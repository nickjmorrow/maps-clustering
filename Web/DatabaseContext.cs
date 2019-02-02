using Microsoft.EntityFrameworkCore;
using WebApplication.Models;
using WebApplication.Models.DTOs;

namespace WebApplication
{
    public class DatabaseContext : DbContext
    {
        public DatabaseContext(DbContextOptions<DatabaseContext> options) : base(options)
        {
        }

        public DbSet<UserItem> UserItems { get; set; }
        public DbSet<User> Users { get; set; }
        public DbSet<Item> Items { get; set; }
        public DbSet<ItemType> ItemTypes { get; set; }
        public DbSet<UserFavoriteItem> UserFavoriteItems { get; set; }
        public DbSet<Point> Points { get; set; }
        public DbSet<PointsGroup> PointsGroups { get; set; }
        
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<UserFavoriteItem>()
                .HasKey(ufi => new {ufi.ItemId, ufi.UserId});
            modelBuilder.Entity<UserItem>()
                .HasKey(ui => new {ui.UserId, ui.ItemId});
        }
    }
}
