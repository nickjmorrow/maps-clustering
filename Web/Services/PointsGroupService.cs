using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Calc;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using Newtonsoft.Json;
using NUnit.Framework;
using Warlock.Services;
using Web.Models;
using WebApplication;
using WebApplication.Controllers;
using WebApplication.Enums;
using WebApplication.Models;
using WebApplication.Models.DTOs;
using WebApplication.Services;
using ItemType = WebApplication.Enums.ItemType;

namespace Web.Services
{
    [Authorize]
    public class PointsGroupService
    {
        private DatabaseContext _context;
        private ItemService _itemService;
        private ItemFilterer _itemFilterer;
        private FileHandlerService _fileHandlerService;
        private AgglomerativeHierarchicalClusteringService _ahcService;

        public PointsGroupService(DatabaseContext context, 
            ItemService itemService, 
            ItemFilterer itemFilterer, 
            FileHandlerService fileHandlerService,
            AgglomerativeHierarchicalClusteringService ahcService)
        {
            _context = context;
            _itemService = itemService;
            _itemFilterer = itemFilterer;
            _fileHandlerService = fileHandlerService;
            _ahcService = ahcService;
        }

        // TODO: should think in terms of 'points groups', and users can be permissioned to whole groups
        // it does'nt make sense to keep track of permissioning on a points-level
        
        // TODO: create has-many relationship between pointsGroup and points
        // be able to upload file and save it as a pointsGroup
        
        // TODO: let me upload a file to replace a pointsGroup
        
        // TODO: let me rename a pointsGroup

        public IEnumerable<PointsGroupDTO> GetPointsGroups(int? userId)
        {
            var allPointsGroups = this._context.PointsGroups
                .Include(pg => pg.Points);
            return this._itemFilterer
                .GetValidItems(userId, allPointsGroups)
                .Select(pg => 
                {
                    var item = this._context.Items.Single(i => i.ItemId == pg.ItemId);
                    return new PointsGroupDTO()
                    {
                        PointsGroupId = pg.PointsGroupId,
                        Name = pg.Name,
                        Points = pg.Points,
                        AverageHorizontalDisplacement = pg.AverageHorizontalDisplacement,
                        AverageVerticalDisplacement = pg.AverageVerticalDisplacement,
                        DateCreated = item.DateCreated,
                        ItemPermissionType = item.ItemPermissionType
                    };
                })
                .ToList();
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
            var pointsGroup = this._context.PointsGroups.Single(pg => pg.PointsGroupId == pointsGroupId);
            var item = this._context.Items.Single(i => i.ItemId == pointsGroup.ItemId);
            item.DateDeleted = DateTime.Now;
            await this._context.SaveChangesAsync();
            return pointsGroup.PointsGroupId;
        }

        /// <summary>
        /// Create a <see cref="PointsGroupDTO"/> from a file.
        /// </summary>
        public async Task<PointsGroupDTO> CreatePointsGroup(IFormFile file)
        {
            var pointsGroup = this._fileHandlerService.ConvertFileToPointsGroup(file);

            return new PointsGroupDTO
            {
                Name = pointsGroup.Name,
                AverageHorizontalDisplacement = pointsGroup.AverageHorizontalDisplacement,
                AverageVerticalDisplacement = pointsGroup.AverageVerticalDisplacement,
                Points = pointsGroup.Points,
                DateCreated = DateTime.Now,
                ItemPermissionType = ItemPermissionType.Public,
                AhcInfo = new AhcInfo
                {
                    AhcPoints = this.GetAhcPoints(pointsGroup.Points)
                }
            };
        }

        /// <summary>
        /// Persist a <see cref="PointsGroup"/> to the database. 
        /// </summary>
        public async Task<int> SavePointsGroup(PointsGroupDTO pointsGroupDto)
        {
            var pointsGroup = new PointsGroup
            {
                Name = pointsGroupDto.Name,
                AverageHorizontalDisplacement = pointsGroupDto.AverageHorizontalDisplacement,
                AverageVerticalDisplacement = pointsGroupDto.AverageVerticalDisplacement,
                Points = pointsGroupDto.Points,
                AhcInfoJson = JsonConvert.SerializeObject(pointsGroupDto.AhcInfo)
            };

            await this._context.AddAsync(pointsGroup);
            return pointsGroup.PointsGroupId;
        }

        private IEnumerable<AhcPointDTO> GetAhcPoints(IEnumerable<Point> points)
        {
            return this.GetAhcPoints(
                this._ahcService.GetModel(
                    this.GetCalcPoints(points)));
        }
        
        private IEnumerable<AhcPointDTO> GetAhcPoints(
            IEnumerable<AgglomerativeHierarchicalClusterPoint> agglomerativeHierarchicalClusterPoints)
        {
            return agglomerativeHierarchicalClusterPoints.Select(ahcp => new AhcPointDTO
            {
                PointId = ahcp.PointId,
                Name = ahcp.Name,
                HorizontalDisplacement = ahcp.HorizontalDisplacement,
                VerticalDisplacement = ahcp.VerticalDisplacement,
                ClusterInfos = this.GetClusterInfos(ahcp.AgglomerativeHierarchicalClusterInfos)
            });
        }

        private IEnumerable<Calc.Models.Point> GetCalcPoints(IEnumerable<Point> points)
        {
            return points.Select(p => new Calc.Models.Point
            {
                PointId = p.PointId,
                Name = p.Name,
                HorizontalDisplacement = p.HorizontalDisplacement,
                VerticalDisplacement = p.VerticalDisplacement
            });
        }

        private IEnumerable<ClusterInfo> GetClusterInfos(
            IEnumerable<AgglomerativeHierarchicalClusterInfo> ahcClusterInfos)
        {
            return ahcClusterInfos.Select(ahcci => new ClusterInfo
            {
                ClusterId = ahcci.ClusterId,
                ClusterCount = ahcci.ClusterCount
            });
        } 
    }
}