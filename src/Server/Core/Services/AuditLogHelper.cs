using System.Reflection;
using System.Text.Json;

namespace Server.Core.Services;

public static class AuditLogHelper
{
    public static string GetChangesJson(object oldValues, object newValues)
    {
        var changes = new List<Dictionary<string, object?>>();

        var oldProps = GetPublicProperties(oldValues);
        var newProps = GetPublicProperties(newValues);

        var names = oldProps.Keys
            .Union(newProps.Keys, StringComparer.Ordinal)
            .Where(n => !IsSensitiveProperty(n))
            .OrderBy(n => n, StringComparer.Ordinal);

        foreach (var name in names)
        {
            oldProps.TryGetValue(name, out var oldValue);
            newProps.TryGetValue(name, out var newValue);

            if (ValuesEqual(oldValue, newValue))
                continue;

            changes.Add(new Dictionary<string, object?>
            {
                ["field"] = name,
                ["old"] = ToJsonSafeValue(oldValue),
                ["new"] = ToJsonSafeValue(newValue)
            });
        }

        return JsonSerializer.Serialize(changes);
    }

    public static string SerializeChanges(object changes)
        => JsonSerializer.Serialize(SanitizeValue(changes));

    public static bool IsSensitiveProperty(string propertyName)
    {
        var sensitive = new[]
        {
            "PasswordHash", "SecurityStamp", "ConcurrencyStamp",
            "xmin", "NormalizedUserName", "NormalizedEmail"
        };
        return sensitive.Contains(propertyName);
    }

    private static Dictionary<string, object?> GetPublicProperties(object values)
    {
        var result = new Dictionary<string, object?>(StringComparer.Ordinal);

        foreach (var property in values.GetType().GetProperties(BindingFlags.Public | BindingFlags.Instance))
        {
            if (!property.CanRead || property.GetIndexParameters().Length > 0)
                continue;

            if (IsSensitiveProperty(property.Name))
                continue;

            result[property.Name] = property.GetValue(values);
        }

        return result;
    }

    private static bool ValuesEqual(object? oldValue, object? newValue)
    {
        if (oldValue is null && newValue is null)
            return true;

        if (oldValue is null || newValue is null)
            return false;

        return Equals(oldValue, newValue);
    }

    private static object? ToJsonSafeValue(object? value)
        => SanitizeValue(value);

    private static object? SanitizeValue(object? value)
    {
        if (value is null)
            return null;

        var type = value.GetType();

        if (type.IsPrimitive || value is string || value is decimal || value is DateTime || value is Guid)
            return value;

        if (value is System.Collections.IEnumerable enumerable and not string)
        {
            var items = new List<object?>();
            foreach (var item in enumerable)
                items.Add(SanitizeValue(item));
            return items;
        }

        var result = new Dictionary<string, object?>(StringComparer.Ordinal);
        foreach (var property in type.GetProperties(BindingFlags.Public | BindingFlags.Instance))
        {
            if (!property.CanRead || property.GetIndexParameters().Length > 0)
                continue;

            if (IsSensitiveProperty(property.Name))
                continue;

            result[property.Name] = SanitizeValue(property.GetValue(value));
        }

        return result;
    }
}
