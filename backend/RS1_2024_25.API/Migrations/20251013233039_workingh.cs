using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace RS1_2024_25.API.Migrations
{
    /// <inheritdoc />
    public partial class workingh : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            // Ako želiš da ostane i ovo brisanje:
            migrationBuilder.DropColumn(
                name: "ImageData",
                table: "Museums");

            // DODAJ kolonu WorkingHours (umjesto AlterColumn)
            migrationBuilder.AddColumn<string>(
                name: "WorkingHours",
                table: "Attractions",
                type: "nvarchar(max)",
                nullable: true);

            // Ako nemaš ImageUrl kolonu, možeš je odmah dodati:
            // migrationBuilder.AddColumn<string>(
            //     name: "ImageUrl",
            //     table: "Attractions",
            //     type: "nvarchar(max)",
            //     nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            // Vrati nazad kako je bilo
            migrationBuilder.AddColumn<byte[]>(
                name: "ImageData",
                table: "Museums",
                type: "varbinary(max)",
                nullable: false,
                defaultValue: new byte[0]);

            migrationBuilder.DropColumn(
                name: "WorkingHours",
                table: "Attractions");

            
        }
    }
}
