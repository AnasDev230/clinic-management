using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Server.Core.Common;

namespace Microsoft.EntityFrameworkCore;

/// <summary>
/// Compatibility shim for Npgsql 9.
/// Npgsql 9 removed the built-in <c>UseXminAsConcurrencyToken()</c> extension;
/// the supported pattern is now mapping a <c>uint xmin</c> property as a row version,
/// which Npgsql maps to the PostgreSQL <c>xmin</c> system column.
/// This extension preserves the AGENTS.md call pattern
/// (<c>builder.UseXminAsConcurrencyToken();</c>) on all entity configurations.
/// </summary>
public static class NpgsqlConcurrencyExtensions
{
    public static EntityTypeBuilder<TEntity> UseXminAsConcurrencyToken<TEntity>(
        this EntityTypeBuilder<TEntity> builder)
        where TEntity : BaseEntity
    {
        builder.Property(e => e.xmin).IsRowVersion();
        return builder;
    }
}
