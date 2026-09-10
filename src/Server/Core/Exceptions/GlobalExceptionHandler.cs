using System.Text.Json;
using FluentValidation;
using Microsoft.AspNetCore.Diagnostics;
using Microsoft.EntityFrameworkCore;
using Server.Core.Common;
using Server.Core.Exceptions;

namespace Server.Core.Exceptions;

public class GlobalExceptionHandler : IExceptionHandler
{
    private readonly ILogger<GlobalExceptionHandler> _logger;
    private readonly IHostEnvironment _environment;

    public GlobalExceptionHandler(ILogger<GlobalExceptionHandler> logger, IHostEnvironment environment)
    {
        _logger = logger;
        _environment = environment;
    }

    public async ValueTask<bool> TryHandleAsync(
        HttpContext httpContext,
        Exception exception,
        CancellationToken cancellationToken)
    {
        _logger.LogError(exception, "Unhandled exception: {Message}", exception.Message);

        var (statusCode, message, errors) = MapException(exception);

        httpContext.Response.StatusCode = statusCode;
        httpContext.Response.ContentType = "application/json";

        var response = ApiResponse<object>.Failure(message, errors);

        var json = JsonSerializer.Serialize(response);
        await httpContext.Response.WriteAsync(json, cancellationToken);

        return true;
    }

    private (int StatusCode, string Message, List<string>? Errors) MapException(Exception exception)
    {
        // Unwrap outer wrappers that hide the real cause (e.g. TargetInvocationException from reflection seeding)
        var current = exception;
        while (current.InnerException is not null &&
               (current is System.Reflection.TargetInvocationException ||
                current is TypeInitializationException))
        {
            current = current.InnerException;
        }

        if (current is not null && !ReferenceEquals(current, exception))
        {
            exception = current;
        }

        return MapSingle(exception);
    }

    private (int StatusCode, string Message, List<string>? Errors) MapSingle(Exception exception) => exception switch
    {
        NotFoundException ex =>
            (StatusCodes.Status404NotFound, ex.Message, null),

        BusinessException ex =>
            (StatusCodes.Status400BadRequest, ex.Message, null),

        ValidationException ve =>
            (StatusCodes.Status400BadRequest,
             ve.Errors.FirstOrDefault()?.ErrorMessage ?? "Validation failed",
             ve.Errors.Select(e => e.ErrorMessage).ToList()),

        UnauthorizedAccessException =>
            (StatusCodes.Status401Unauthorized, "Unauthorized access", null),

        DbUpdateConcurrencyException =>
            (StatusCodes.Status409Conflict,
             "Data was modified by another user. Please refresh and try again", null),

        DbUpdateException =>
            (StatusCodes.Status500InternalServerError,
             "A database error occurred. Please try again", null),

        JsonException =>
            (StatusCodes.Status400BadRequest, "Invalid request format", null),

        InvalidOperationException ex =>
            (StatusCodes.Status400BadRequest, ex.Message, null),

        ArgumentException ex =>
            (StatusCodes.Status400BadRequest, ex.Message, null),

        _ =>
            (StatusCodes.Status500InternalServerError,
             _environment.IsDevelopment() ? exception.Message : "An unexpected server error occurred. Please try again",
             null)
    };
}
