namespace Server.Features.Dashboard.Models;

public class RevenueSummaryResponse
{
    public decimal TotalRevenue { get; set; }
    public decimal TotalPaid { get; set; }
    public decimal TotalOutstanding { get; set; }
    public decimal TotalOverdue { get; set; }
    public int TotalInvoices { get; set; }
    public int PaidInvoices { get; set; }
    public int OverdueInvoices { get; set; }
    public List<PaymentMethodBreakdown> ByMethod { get; set; } = new();
}

public class PaymentMethodBreakdown
{
    public string Method { get; set; } = string.Empty;
    public int Count { get; set; }
    public decimal Amount { get; set; }
}
