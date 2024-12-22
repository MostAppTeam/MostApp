using iTextSharp.text;
using iTextSharp.text.pdf;
using Microsoft.AspNetCore.Mvc;
using System.IO;

[ApiController]
[Route("api/reports")]
public class ReportController : ControllerBase
{
    [HttpGet("generate")]
    public IActionResult GeneratePdfReport([FromQuery] string id, [FromQuery] DateTime startDate, [FromQuery] DateTime endDate)
    {
        // Priprema podataka
        var reportData = $"Report ID: {id}\nDate Range: {startDate:yyyy-MM-dd} to {endDate:yyyy-MM-dd}";

        using (MemoryStream stream = new MemoryStream())
        {
            Document document = new Document();
            PdfWriter.GetInstance(document, stream);
            document.Open();

            // Naslov
            document.Add(new Paragraph("PDF Report"));
            document.Add(new Paragraph("\n"));

            // Detalji
            document.Add(new Paragraph(reportData));

            // Zatvaranje dokumenta
            document.Close();

            // Vraćanje PDF-a kao odgovor
            byte[] bytes = stream.ToArray();
            return File(bytes, "application/pdf", $"Report_{id}.pdf");
        }
    }
}
