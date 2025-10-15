using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace RS1_2024_25.API.Migrations
{
    /// <inheritdoc />
    public partial class a : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.Sql(@"
IF COL_LENGTH('dbo.Attractions', 'TicketPrice') IS NOT NULL
BEGIN
    DECLARE @dc sysname;
    SELECT @dc = d.name
    FROM sys.default_constraints d
    JOIN sys.columns c 
      ON d.parent_object_id = c.object_id AND d.parent_column_id = c.column_id
    WHERE d.parent_object_id = OBJECT_ID(N'dbo.Attractions')
      AND c.name = N'TicketPrice';

    IF @dc IS NOT NULL 
        EXEC(N'ALTER TABLE [dbo].[Attractions] DROP CONSTRAINT [' + @dc + ']');

    ALTER TABLE [dbo].[Attractions] DROP COLUMN [TicketPrice];
END
");
        }




        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "ActivityLogs");

            migrationBuilder.DropTable(
                name: "Bookings");

            migrationBuilder.DropTable(
                name: "Notifications");

            migrationBuilder.DropTable(
                name: "Orders");

            migrationBuilder.DropTable(
                name: "Reviews");

            migrationBuilder.DropColumn(
                name: "Email",
                table: "MyAppUsers");

            migrationBuilder.DropColumn(
                name: "VirtualTourURL",
                table: "Attractions");

            migrationBuilder.AddColumn<decimal>(
                name: "TicketPrice",
                table: "Attractions",
                type: "decimal(18,2)",
                precision: 18,
                scale: 2,
                nullable: true);
        }
    }
}
