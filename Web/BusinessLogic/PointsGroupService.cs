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

        public IReadOnlyList<PointsGroupModel> GetPointsGroups(int? userId)
        {
            var allPointsGroups = this._context.PointsGroups
                .Include(pg => pg.Points)
                .ToList();

            return this._itemFilterer
                .GetValidItems(userId, allPointsGroups)
                .Select(pg =>
                {
                    var item = this._context.Items.Single(i => i.ItemId == pg.ItemId);
                    return this.GetPointsGroupModel(pg, item);
                })
                .ToList();
        }

        public async Task<PointsGroupModel> AddPointsGroupAsync(int userId, IFormFile file)
        {
            var pointsGroup = this._fileHandlerService.ConvertFileToPointsGroupModel(file);
            return (await this.AddPointsGroupAsyncInternal(userId, pointsGroup));
        }

        /// <summary>
        /// Create a <see cref="PointsGroup"/> and persist it to the database.
        /// </summary>
        /// <returns></returns>
        private async Task<PointsGroupModel> AddPointsGroupAsyncInternal(int userId, PointsGroup pointsGroup)
        {
            // create itemId for pointsGroup
            var itemId = await this._itemService.AddItemAsync((int) ItemType.PointsGroup);
            pointsGroup.ItemId = itemId;
            
            await this._context.PointsGroups.AddAsync(pointsGroup);
            await this._context.SaveChangesAsync();
            
            await this._context.UserItems.AddAsync(new UserItem() {UserId = userId, ItemId = itemId});
            await this._context.SaveChangesAsync();

            pointsGroup.ClusteringOutputJson = JsonConvert.SerializeObject(this.GetCalculationOutputModel(pointsGroup.Points));
            
            this._context.Update(pointsGroup);
            await this._context.SaveChangesAsync();

            return this.GetPointsGroupModel(pointsGroup, this._context.Items.Single(i => i.ItemId == itemId));
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
        /// Create a <see cref="PointsGroupModel"/> from a file.
        /// </summary>
        public PointsGroupModel CreatePointsGroupAsync(IFormFile file)
        {
            var pointsGroup = this._fileHandlerService.ConvertFileToPointsGroupModel(file);
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
        public async Task<PointsGroupModel> SavePointsGroupAsync(int userId, PointsGroupModel pointsGroupModel)
        {
            var pointsGroup = new PointsGroup
            {
                Name = pointsGroupModel.Name,
                AverageHorizontalDisplacement = pointsGroupModel.AverageHorizontalDisplacement,
                AverageVerticalDisplacement = pointsGroupModel.AverageVerticalDisplacement,
                Points = pointsGroupModel.Points.Select(p => new PointModel
                    {
                        HorizontalDisplacement = p.HorizontalDisplacement,
                        VerticalDisplacement = p.VerticalDisplacement,
                        Name = p.Name
                    }
                ).ToList()
            };

            return (await this.AddPointsGroupAsyncInternal(userId, pointsGroup));
        }

        private IEnumerable<PointModel> GetCalcPoints(IEnumerable<PointModel> points)
        {
            return points.Select(p => new PointModel
            {
                PointId = p.PointId,
                Name = p.Name,
                HorizontalDisplacement = p.HorizontalDisplacement,
                VerticalDisplacement = p.VerticalDisplacement
            });
        }

        // TODO: wtf is this used for?
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
        /// Used to get <see cref="PointsGroupModel"/> from a persisted <see cref="PointsGroup"/>.
        /// </summary>
        private PointsGroupModel GetPointsGroupModel(PointsGroup pointsGroup, Item item)
        {
            return new PointsGroupModel()
            {
                PointsGroupId = pointsGroup.PointsGroupId,
                Name = pointsGroup.Name,
                Points = pointsGroup.Points,
                AverageHorizontalDisplacement = pointsGroup.AverageHorizontalDisplacement,
                AverageVerticalDisplacement = pointsGroup.AverageVerticalDisplacement,
                ItemPermissionType = item.ItemPermissionTypeId,
                CalculationOutput = JsonConvert.DeserializeObject<CalculationOutputModel>(pointsGroup.ClusteringOutputJson)
            };
        }
        
        /// <summary>
        /// Used to get <see cref="PointsGroupModel"/> from <see cref="PointsGroup"/>
        /// that is not associated with a user and has not yet been persisted.
        /// </summary>
        private PointsGroupModel GetPointsGroupDto(PointsGroup pointsGroup)
        {
            return new PointsGroupModel
            {
                Name = pointsGroup.Name,
                AverageHorizontalDisplacement = pointsGroup.AverageHorizontalDisplacement,
                AverageVerticalDisplacement = pointsGroup.AverageVerticalDisplacement,
                Points = pointsGroup.Points,
                ItemPermissionType = ItemPermissionType.Public,
                CalculationOutput = this.GetCalculationOutputModel(pointsGroup.Points)
            };
        }

        private CalculationOutputModel GetCalculationOutputModel(IEnumerable<PointModel> points)
        {
            var calcPoints = this.GetCalcPoints(points);
            var clusteringOutput = this._clusteringService.GetCalculationOutput(calcPoints);
            var orderedPoints = clusteringOutput.OrderedPoints.Select(ahcp => new OrderedPoint()
            {
                PointId = ahcp.PointId,
                Name = ahcp.Name,
                HorizontalDisplacement = ahcp.HorizontalDisplacement,
                VerticalDisplacement = ahcp.VerticalDisplacement,
                ClusterSnapshots = this.GetClusterInfos(ahcp.ClusterSnapshots),
                OrderingSnapshots = ahcp.OrderingSnapshots
            });
            return new CalculationOutputModel
            {
                OrderedPoints = orderedPoints,
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