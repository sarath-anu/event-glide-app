
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { getInvoiceById } from "@/lib/supabase-data";
import { toast } from "@/hooks/use-toast";
import { format } from "date-fns";

interface InvoiceDownloadProps {
  invoiceId: string;
  className?: string;
}

const InvoiceDownload = ({ invoiceId, className }: InvoiceDownloadProps) => {
  const generateInvoicePDF = async () => {
    try {
      const invoice = await getInvoiceById(invoiceId);
      if (!invoice) {
        toast({
          title: "Error",
          description: "Invoice not found.",
          variant: "destructive",
        });
        return;
      }

      // Create HTML content for the invoice
      const htmlContent = `
        <!DOCTYPE html>
        <html>
        <head>
          <title>Invoice ${invoice.invoice_number}</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 40px; color: #333; }
            .header { display: flex; justify-content: space-between; margin-bottom: 40px; }
            .company { font-size: 24px; font-weight: bold; }
            .invoice-title { font-size: 28px; font-weight: bold; color: #2563eb; }
            .details { margin-bottom: 30px; }
            .table { width: 100%; border-collapse: collapse; margin-top: 20px; }
            .table th, .table td { padding: 12px; text-align: left; border-bottom: 1px solid #ddd; }
            .table th { background-color: #f8f9fa; font-weight: bold; }
            .total { text-align: right; margin-top: 20px; font-size: 18px; font-weight: bold; }
            .footer { margin-top: 40px; text-align: center; color: #666; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="header">
            <div>
              <div class="company">EventEase</div>
              <div>123 Event Street<br>City, State 12345<br>contact@eventease.com</div>
            </div>
            <div>
              <div class="invoice-title">INVOICE</div>
              <div><strong>Invoice #:</strong> ${invoice.invoice_number}</div>
              <div><strong>Date:</strong> ${format(new Date(invoice.invoice_date), "MMM dd, yyyy")}</div>
              <div><strong>Due Date:</strong> ${format(new Date(invoice.due_date), "MMM dd, yyyy")}</div>
            </div>
          </div>

          <div class="details">
            <h3>Event Details</h3>
            <strong>Event:</strong> ${invoice.event_bookings?.events?.name || 'N/A'}<br>
            <strong>Date:</strong> ${invoice.event_bookings?.events?.event_date ? format(new Date(invoice.event_bookings.events.event_date), "MMM dd, yyyy") : 'N/A'}<br>
            <strong>Venue:</strong> ${invoice.event_bookings?.events?.venue || 'N/A'}<br>
            <strong>City:</strong> ${invoice.event_bookings?.events?.city || 'N/A'}
          </div>

          <table class="table">
            <thead>
              <tr>
                <th>Description</th>
                <th>Quantity</th>
                <th>Unit Price</th>
                <th>Amount</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>${invoice.event_bookings?.ticket_type || 'Event Ticket'}</td>
                <td>${invoice.event_bookings?.quantity || 1}</td>
                <td>$${((invoice.subtotal || 0) / (invoice.event_bookings?.quantity || 1)).toFixed(2)}</td>
                <td>$${(invoice.subtotal || 0).toFixed(2)}</td>
              </tr>
            </tbody>
          </table>

          <div class="total">
            <div>Subtotal: $${(invoice.subtotal || 0).toFixed(2)}</div>
            ${invoice.tax_amount ? `<div>Tax: $${invoice.tax_amount.toFixed(2)}</div>` : ''}
            <div style="border-top: 2px solid #333; padding-top: 10px; margin-top: 10px;">
              Total: $${(invoice.total_amount || 0).toFixed(2)}
            </div>
          </div>

          <div class="footer">
            <p>Thank you for your business!</p>
            <p>Payment Status: ${invoice.status.toUpperCase()}</p>
            ${invoice.payment_method ? `<p>Payment Method: ${invoice.payment_method}</p>` : ''}
          </div>
        </body>
        </html>
      `;

      // Create a new window and print
      const printWindow = window.open('', '_blank');
      if (printWindow) {
        printWindow.document.write(htmlContent);
        printWindow.document.close();
        printWindow.onload = () => {
          printWindow.print();
        };
      }

      toast({
        title: "Invoice Generated",
        description: "Invoice has been opened for download/printing.",
      });
    } catch (error) {
      console.error("Error generating invoice:", error);
      toast({
        title: "Error",
        description: "Failed to generate invoice.",
        variant: "destructive",
      });
    }
  };

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={generateInvoicePDF}
      className={className}
    >
      <Download className="h-4 w-4 mr-2" />
      Download Invoice
    </Button>
  );
};

export default InvoiceDownload;
