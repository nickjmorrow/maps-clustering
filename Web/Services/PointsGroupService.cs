using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Calc;
using Calc.Models;
using Calc.Models.AgglomerativeHierarchicalClustering;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using Newtonsoft.Json;
using WebApplication;
using WebApplication.Enums;
using WebApplication.Models;
using WebApplication.Models.DTOs;
using WebApplication.Services;
using ItemType = WebApplication.Enums.ItemType;

namespace Web.Services
{
    [Authorize]
    public  class PointsGroupService
    {
        private DatabaseContext _context;
        private ItemService _itemService;
        private ItemFilterer _itemFilterer;
        private FileHandlerService _fileHandlerService;
        private ClusteringService _clusteringService;

        public PointsGroupService(DatabaseContext context, 
            ItemService itemService, 
            ItemFilterer itemFilterer, 
            FileHandlerService fileHandlerService,
            ClusteringService clusteringService)
        {
            this._context = context;
            this._itemService = itemService;
            this._itemFilterer = itemFilterer;
            this._fileHandlerService = fileHandlerService;
            this._clusteringService = clusteringService;
        }

        // TODO: should think in terms of 'points groups', and users can be permissioned to whole groups
        // it does'nt make sense to keep track of permissioning on a points-level
        
        // TODO: let me upload a file to replace a pointsGroup
        
        // TODO: let me rename a pointsGroup
        
        // TODO: add tests here

        public IEnumerable<PointsGroupDto> GetPointsGroups(int? userId)
        {
            var allPointsGroups = this._context.PointsGroups
                .Include(pg => pg.Points);
            
            return this._itemFilterer
                .GetValidItems(userId, allPointsGroups)
                .Select(pg => 
                {
                    var item = this._context.Items.Single(i => i.ItemId == pg.ItemId);
                    return this.GetPointsGroupDto(pg, item);

                })
                .ToList();
        }

        public async Task<PointsGroupDto> AddPointsGroupAsync(int userId, IFormFile file)
        {
            var pointsGroup = this._fileHandlerService.ConvertFileToPointsGroup(file);
            return (await this.AddPointsGroupAsyncInternal(userId, pointsGroup));
        }

        /// <summary>
        /// Create a <see cref="PointsGroup"/> and persist it to the database.
        /// </summary>
        /// <returns></returns>
        public async Task<PointsGroupDto> AddPointsGroupAsyncInternal(int userId, PointsGroup pointsGroup)
        {
            // create itemId for pointsGroup
            var itemId = await this._itemService.AddItemAsync((int) ItemType.PointsGroup);
            pointsGroup.ItemId = itemId;
            
            await this._context.PointsGroups.AddAsync(pointsGroup);
            await this._context.SaveChangesAsync();
            
            await this._context.UserItems.AddAsync(new UserItem() {UserId = userId, ItemId = itemId});
            await this._context.SaveChangesAsync();

            pointsGroup.ClusteringOutputJson = JsonConvert.SerializeObject(this.GetClusteringOutputDto(pointsGroup.Points));
            
            this._context.Update(pointsGroup);
            await this._context.SaveChangesAsync();

            return this.GetPointsGroupDto(pointsGroup, this._context.Items.Single(i => i.ItemId == itemId));
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
        /// Create a <see cref="PointsGroupDto"/> from a file.
        /// </summary>
        public PointsGroupDto CreatePointsGroupAsync(IFormFile file)
        {
            var pointsGroup = this._fileHandlerService.ConvertFileToPointsGroup(file);
            pointsGroup.Points = pointsGroup.Points.Select((p, i) =>
            {
                p.PointId = i + 1;
                return p;
            }).ToList();

            var pointsGroupDto = this.GetPointsGroupDto(pointsGroup); 
            return pointsGroupDto;
        }

        /// <summary>
        /// Persist a <see cref="PointsGroup"/> to the database. 
        /// </summary>
        public async Task<PointsGroupDto> SavePointsGroupAsync(int userId, PointsGroupDto pointsGroupDto)
        {
            var pointsGroup = new PointsGroup
            {
                Name = pointsGroupDto.Name,
                AverageHorizontalDisplacement = pointsGroupDto.AverageHorizontalDisplacement,
                AverageVerticalDisplacement = pointsGroupDto.AverageVerticalDisplacement,
                Points = pointsGroupDto.Points.Select(p => new PointDto
                    {
                        HorizontalDisplacement = p.HorizontalDisplacement,
                        VerticalDisplacement = p.VerticalDisplacement,
                        Name = p.Name
                    }
                ).ToList()
            };

            return (await this.AddPointsGroupAsyncInternal(userId, pointsGroup));
        }

        private IEnumerable<PointDto> GetCalcPoints(IEnumerable<PointDto> points)
        {
            return points.Select(p => new PointDto
            {
                PointId = p.PointId,
                Name = p.Name,
                HorizontalDisplacement = p.HorizontalDisplacement,
                VerticalDisplacement = p.VerticalDisplacement
            });
        }

        private IEnumerable<ClusterSnapshot> GetClusterInfos(
            IEnumerable<ClusterSnapshot> ahcClusterInfos)
        {
            return ahcClusterInfos.Select(ahcci => new ClusterSnapshot
            {
                ClusterId = ahcci.ClusterId,
                ClusterCount = ahcci.ClusterCount
            });
        } 
        
        /// <summary>
        /// Used to get <see cref="PointsGroupDto"/> from a persisted <see cref="PointsGroup"/>.
        /// </summary>
        private PointsGroupDto GetPointsGroupDto(PointsGroup pointsGroup, Item item)
        {
            return new PointsGroupDto()
            {
                PointsGroupId = pointsGroup.PointsGroupId,
                Name = pointsGroup.Name,
                Points = pointsGroup.Points,
                AverageHorizontalDisplacement = pointsGroup.AverageHorizontalDisplacement,
                AverageVerticalDisplacement = pointsGroup.AverageVerticalDisplacement,
                ItemPermissionType = item.ItemPermissionTypeId,
                ClusteringOutput = JsonConvert.DeserializeObject<ClusteringOutputDto>(pointsGroup.ClusteringOutputJson)
            };
        }
        
        /// <summary>
        /// Used to get <see cref="PointsGroupDto"/> from <see cref="PointsGroup"/>
        /// that is not associated with a user and has not yet been persisted.
        /// </summary>
        private PointsGroupDto GetPointsGroupDto(PointsGroup pointsGroup)
        {
            return new PointsGroupDto
            {
                Name = pointsGroup.Name,
                AverageHorizontalDisplacement = pointsGroup.AverageHorizontalDisplacement,
                AverageVerticalDisplacement = pointsGroup.AverageVerticalDisplacement,
                Points = pointsGroup.Points,
                ItemPermissionType = ItemPermissionType.Public,
                ClusteringOutput = this.GetClusteringOutputDto(pointsGroup.Points)
            };
        }

        private ClusteringOutputDto GetClusteringOutputDto(IEnumerable<PointDto> points)
        {
            var calcPoints = this.GetCalcPoints(points);
            var clusteringOutput = this._clusteringService.GetClusteringOutput(calcPoints);
            var ahcPointDtos = clusteringOutput.AgglomerativeHierarchicalClusterPoints.Select(ahcp => new ClusteredPoint
            {
                PointId = ahcp.PointId,
                Name = ahcp.Name,
                HorizontalDisplacement = ahcp.HorizontalDisplacement,
                VerticalDisplacement = ahcp.VerticalDisplacement,
                ClusterSnapshots = this.GetClusterInfos(ahcp.ClusterSnapshots)
            });
            return new ClusteringOutputDto
            {
                ClusteredPoints = ahcPointDtos,
                ClusteringSummaries = clusteringOutput.ClusteringSummaries.Select(GetClusteringSummaryDto)
            };

        }
        
        private ClusteringSummaryDto GetClusteringSummaryDto(ClusteringSummary clusteringSummary)
        {
            return new ClusteringSummaryDto()
            {
                ClusterCount = clusteringSummary.ClusterCount,
                InterclusterDistance = clusteringSummary.InterclusterDistance.ToMask(),
                IntraclusterDistances = clusteringSummary.IntraclusterDistances.Select(icd =>
                    new IntraclusterDistanceDto()
                    {
                        ClusterId = icd.ClusterId,
                        Distance = icd.Distance.ToMask()
                    }),
                AverageIntraclusterDistance = clusteringSummary.AverageIntraclusterDistance.ToMask(),
                AverageClusterSize = clusteringSummary.AverageClusterSize.ToMask("0.0", " points")
            };
        }
    }
}