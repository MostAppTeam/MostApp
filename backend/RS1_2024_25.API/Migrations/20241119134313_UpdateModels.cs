using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace RS1_2024_25.API.Migrations
{
    /// <inheritdoc />
    public partial class UpdateModels : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "FirstName",
                table: "Users",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "LastName",
                table: "Users",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "Role",
                table: "Users",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<int>(
                name: "UserId",
                table: "TouristAgencies",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<TimeSpan>(
                name: "ClosingTime",
                table: "ShoppingCenters",
                type: "time",
                nullable: false,
                defaultValue: new TimeSpan(0, 0, 0, 0, 0));

            migrationBuilder.AddColumn<TimeSpan>(
                name: "OpeningTime",
                table: "ShoppingCenters",
                type: "time",
                nullable: false,
                defaultValue: new TimeSpan(0, 0, 0, 0, 0));

            migrationBuilder.AddColumn<int>(
                name: "CategoryID",
                table: "Offers",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Status",
                table: "Offers",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<int>(
                name: "CategoryID",
                table: "Attractions",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<decimal>(
                name: "TicketPrice",
                table: "Attractions",
                type: "decimal(18,2)",
                precision: 18,
                scale: 2,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "WorkingHours",
                table: "Attractions",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.CreateIndex(
                name: "IX_TouristAgencies_UserId",
                table: "TouristAgencies",
                column: "UserId");

            migrationBuilder.CreateIndex(
                name: "IX_Offers_CategoryID",
                table: "Offers",
                column: "CategoryID");

            migrationBuilder.CreateIndex(
                name: "IX_Attractions_CategoryID",
                table: "Attractions",
                column: "CategoryID");

            migrationBuilder.AddForeignKey(
                name: "FK_Attractions_Categories_CategoryID",
                table: "Attractions",
                column: "CategoryID",
                principalTable: "Categories",
                principalColumn: "ID");

            migrationBuilder.AddForeignKey(
                name: "FK_Offers_Categories_CategoryID",
                table: "Offers",
                column: "CategoryID",
                principalTable: "Categories",
                principalColumn: "ID");

            migrationBuilder.AddForeignKey(
                name: "FK_TouristAgencies_Users_UserId",
                table: "TouristAgencies",
                column: "UserId",
                principalTable: "Users",
                principalColumn: "ID");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Attractions_Categories_CategoryID",
                table: "Attractions");

            migrationBuilder.DropForeignKey(
                name: "FK_Offers_Categories_CategoryID",
                table: "Offers");

            migrationBuilder.DropForeignKey(
                name: "FK_TouristAgencies_Users_UserId",
                table: "TouristAgencies");

            migrationBuilder.DropIndex(
                name: "IX_TouristAgencies_UserId",
                table: "TouristAgencies");

            migrationBuilder.DropIndex(
                name: "IX_Offers_CategoryID",
                table: "Offers");

            migrationBuilder.DropIndex(
                name: "IX_Attractions_CategoryID",
                table: "Attractions");

            migrationBuilder.DropColumn(
                name: "FirstName",
                table: "Users");

            migrationBuilder.DropColumn(
                name: "LastName",
                table: "Users");

            migrationBuilder.DropColumn(
                name: "Role",
                table: "Users");

            migrationBuilder.DropColumn(
                name: "UserId",
                table: "TouristAgencies");

            migrationBuilder.DropColumn(
                name: "ClosingTime",
                table: "ShoppingCenters");

            migrationBuilder.DropColumn(
                name: "OpeningTime",
                table: "ShoppingCenters");

            migrationBuilder.DropColumn(
                name: "CategoryID",
                table: "Offers");

            migrationBuilder.DropColumn(
                name: "Status",
                table: "Offers");

            migrationBuilder.DropColumn(
                name: "CategoryID",
                table: "Attractions");

            migrationBuilder.DropColumn(
                name: "TicketPrice",
                table: "Attractions");

            migrationBuilder.DropColumn(
                name: "WorkingHours",
                table: "Attractions");
        }
    }
}
