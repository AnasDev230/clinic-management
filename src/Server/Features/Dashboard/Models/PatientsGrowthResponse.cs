namespace Server.Features.Dashboard.Models;

public class PatientsGrowthResponse
{
    public List<MonthlyGrowth> Months { get; set; } = new();
}

public class MonthlyGrowth
{
    public string MonthName { get; set; } = string.Empty;
    public int Year { get; set; }
    public int NewPatients { get; set; }
    public int TotalPatients { get; set; }
}
