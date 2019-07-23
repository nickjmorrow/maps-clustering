using Microsoft.EntityFrameworkCore;
using Web.Models;
using WebApplication.Models;

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
        public DbSet<PointsGroup> PointsGroups { get; set; }
        public DbSet<DatabaseSetting> DatabaseSettings { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<UserItem>()
                .HasKey(ui => new {ui.UserId, ui.ItemId});
        }
    }
}
