using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using WebApplication;
using WebApplication.Models.DTOs;

namespace Web.Services
{
    public class PointService
    {
        private DatabaseContext _context;

        public PointService(DatabaseContext context)
        {
            this._context = context;
        }

        public async Task<IEnumerable<Point>> GetPointsAsync(int userId)
        {
            using (var context = this._context)
            {
                var userItems = context.UserItems.Select(ui => ui.ItemId);
                var points = await context.Points
                    .Where(p => userItems.Contains(p.ItemId))
                    .ToListAsync();
                return points;
            }
        }

        public async Task<IEnumerable<Point>> AddPointsAsync(int userId, IEnumerable<Point> points)
        {
            using (var context = this._context)
            {
                await context.Points.AddRangeAsync(points);

                foreach (var point in points)
                {
                    
                }
            }
        }
    }
}