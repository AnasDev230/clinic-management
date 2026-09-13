namespace Server.Features.Billing.Models;

public class InvoiceSummaryResponse
{
    public int TotalInvoices { get; set; }

    public decimal TotalAmount { get; set; }

    public decimal TotalPaid { get; set; }

    public decimal TotalOutstanding { get; set; }

    public int OverdueCount { get; set; }

    public decimal OverdueAmount { get; set; }
}
