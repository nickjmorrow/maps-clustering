using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using WebApplication;
using WebApplication.Enums;
using WebApplication.Models.DTOs;

namespace Web.Services
{
    public class PointService
    {
        private DatabaseContext _context;
        private ItemService _itemService;

        public PointService(DatabaseContext context, ItemService itemService)
        {
            this._context = context;
            this._itemService = itemService;
        }

        public async Task<IEnumerable<Point>> GetPointsAsync(int userId)
        {
            using (var context = this._context)
            {
                var userItems = context.UserItems.Select(ui => ui.ItemId);
                var items = context.Items
                    .Where(i => context.Points.Select(p => p.ItemId).Contains(i.ItemId))
                    .Where(i => !i.DateDeleted.HasValue);
                var points = await context.Points
                    .Where(p => userItems.Contains(p.ItemId))
                    .Where(p => items.Select(i => i.ItemId).Contains(p.ItemId))
                    .ToListAsync();
                
                return points;
            }
        }

        public async Task<IEnumerable<Point>> AddPointsAsync(int userId, IEnumerable<Point> points)
        {
            using (var context = this._context)
            {
                await context.Points.AddRangeAsync(points);
            }

            this.PopulatePointItemIdsAsync(points);
        }

        private async Task<IEnumerable<Point>> PopulatePointItemIdsAsync(IEnumerable<Point> points)
        {
            using (var context = this._context)
            {
               foreach (var point in points)
               {
                   var itemId = await this._itemService.AddItemAsync((int) ItemType.Point);
                   point.ItemId = itemId;
   
                   context.Points.Update(point);
                   await context.SaveChangesAsync();
               } 
            }
            
        }
    }
}