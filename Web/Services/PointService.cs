using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.EntityFrameworkCore;
using NUnit.Framework;
using Warlock.Services;
using WebApplication;
using WebApplication.Models;
using WebApplication.Models.DTOs;
using ItemType = WebApplication.Enums.ItemType;

namespace Web.Services
{
    [Authorize]
    public class PointService
    {
        private DatabaseContext _context;
        private ItemService _itemService;
        private UserItemService _userItemService;

        public PointService(DatabaseContext context, ItemService itemService, UserItemService userItemService)
        {
            this._context = context;
            this._itemService = itemService;
            this._userItemService = userItemService;
        }

        // TODO: should think in terms of 'points groups', and users can be permissioned to whole groups
        // it does'nt make sense to keep track of permissioning on a points-level
        
        // TODO: create has-many relationship between pointsGroup and points
        // be able to upload file and save it as a pointsGroup
        
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

        public async Task<IEnumerable<Point>> AddPointsAsync(int userId, PointsGroup pointsGroup, IEnumerable<Point> points)
        {
            var pointsGroupId = await this.AddPointsGroupAsync(userId, pointsGroup);
            using (var context = this._context)
            {
                await context.Points.AddRangeAsync(points.Select(p =>
                {
                    p.PointsGroupId = pointsGroupId;
                    return p;
                }));
            }

            return points;
        }

        public async Task<IEnumerable<PointsGroup>> GetPointsGroupsAsync(int userId)
        {
            using (var context = this._context)
            {
                var pointsGroupUserItems = this._userItemService.GetUserItems(userId)
                    .Where(i => !i.DateDeleted.HasValue && i.ItemTypeId == (int) ItemType.PointsGroup);
                return context.PointsGroups
                    .Where(pg => pointsGroupUserItems.Select(pgui => pgui.ItemId).Contains(pg.ItemId));
            }
        }

        private async Task<int> AddPointsGroupAsync(int userId, PointsGroup pointsGroup)
        {
            var itemId = await this._itemService.AddItemAsync((int) ItemType.PointsGroup);
            using (var context = this._context)
            {
                pointsGroup.ItemId = itemId;
                await context.PointsGroups.AddAsync(pointsGroup);
                await context.UserItems.AddAsync(new UserItem() {UserId = userId, ItemId = itemId});
                await context.SaveChangesAsync();
                return pointsGroup.PointsGroupId;
            }
        }
    }
}