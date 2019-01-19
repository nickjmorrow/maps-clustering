using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.EntityFrameworkCore;
using NUnit.Framework;
using Warlock.Services;
using WebApplication;
using WebApplication.Controllers;
using WebApplication.Models;
using WebApplication.Models.DTOs;
using ItemType = WebApplication.Enums.ItemType;

namespace Web.Services
{
    [Authorize]
    public class PointsGroupService
    {
        private DatabaseContext _context;
        private ItemService _itemService;
        private ItemFilterer _itemFilterer;

        public PointsGroupService(DatabaseContext context, 
            ItemService itemService, 
            ItemFilterer itemFilterer)
        {
            this._context = context;
            this._itemService = itemService;
            this._itemFilterer = itemFilterer;
        }

        // TODO: should think in terms of 'points groups', and users can be permissioned to whole groups
        // it does'nt make sense to keep track of permissioning on a points-level
        
        // TODO: create has-many relationship between pointsGroup and points
        // be able to upload file and save it as a pointsGroup
        
        // TODO: let me upload a file to replace a pointsGroup
        
        // TODO: let me rename a pointsGroup

        public IEnumerable<PointsGroup> GetPointsGroups(int userId)
        {
            var pointsGroups = this._context.PointsGroups
                .Include(pg => pg.Points);
            return this._itemFilterer.GetValidItems(userId, pointsGroups);
        }

        public async Task<PointsGroup> AddPointsGroupAsync(int userId, PointsGroupInput pointsGroupInput)
        {
            // create itemId for pointsGroup
            var itemId = await this._itemService.AddItemAsync((int) ItemType.PointsGroup);
            
            var averageHorizontalDisplacement = pointsGroupInput.Points
                .Select(p => p.HorizontalDisplacement)
                .Average();

            var averageVerticalDisplacement = pointsGroupInput.Points
                .Select(p => p.VerticalDisplacement)
                .Average();
            
            var pointsGroup = new PointsGroup()
            {
                Name = pointsGroupInput.Name,
                AverageHorizontalDisplacement = averageHorizontalDisplacement,
                AverageVerticalDisplacement = averageVerticalDisplacement,
                ItemId = itemId
            };
            
            // add pointsGroup
            await this._context.PointsGroups.AddAsync(pointsGroup);
            await this._context.UserItems.AddAsync(new UserItem() {UserId = userId, ItemId = itemId});
            await this._context.SaveChangesAsync();
                
            // label points with pointsGroupId
            var points = pointsGroupInput.Points.Select((p, i) =>
            {
                return new Point()
                {
                    PointsGroupId = pointsGroup.PointsGroupId,
                    HorizontalDisplacement = p.HorizontalDisplacement,
                    VerticalDisplacement = p.VerticalDisplacement,
                    Name = p.Name
                };
            });
            
            // add associated points 
            await this._context.Points.AddRangeAsync(points);
            await this._context.SaveChangesAsync();
            return pointsGroup;
        }

        public async Task<int> DeletePointsGroupAsync(int pointsGroupId)
        {
            var pointsGroup = this._context.PointsGroups.First(pg => pg.PointsGroupId == pointsGroupId);
            var points = this._context.Points.Where(p => p.PointsGroupId == pointsGroupId);
            this._context.Points.RemoveRange(points);
            await this._context.SaveChangesAsync();

            var userItem = this._context.UserItems.First(ui => ui.ItemId == pointsGroup.ItemId);
            this._context.UserItems.Remove(userItem);
            await this._context.SaveChangesAsync();

            var item = this._context.Items.First(i => i.ItemId == pointsGroup.ItemId);
            this._context.Items.Remove(item);
            await this._context.SaveChangesAsync();
            
            this._context.PointsGroups.Remove(pointsGroup);
            await this._context.SaveChangesAsync();
            return pointsGroupId;
        }
    }
}