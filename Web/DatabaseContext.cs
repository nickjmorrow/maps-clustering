using Microsoft.EntityFrameworkCore;
using WebApplication.Models;
using WebApplication.Models.DTOs;

namespace WebApplication
{
    public class DatabaseContext : DbContext
    {
        // You can add custom code to this file. Changes will not be overwritten.
        // 
        // If you want Entity Framework to drop and regenerate your database
        // automatically whenever you change your model schema, please use data migrations.
        // For more information refer to the documentation:
        // http://msdn.microsoft.com/en-us/data/jj591621.aspx
    
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
            modelBuilder.Entity<WizardSpell>()
                .HasKey(ws => new {ws.SpellId, ws.WizardId});
            modelBuilder.Entity<WizardSpell>()
                .HasOne(ws => ws.Spell)
                .WithMany(ws => ws.WizardSpells)
                .HasForeignKey(ws => ws.SpellId);
            modelBuilder.Entity<WizardSpell>()
                .HasOne(ws => ws.Wizard)
                .WithMany(ws => ws.WizardSpells)
                .HasForeignKey(ws => ws.WizardId);
            modelBuilder.Entity<UserFavoriteItem>()
                .HasKey(ufi => new {ufi.ItemId, ufi.UserId});
        }
    }
}
