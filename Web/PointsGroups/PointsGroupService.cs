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
        private readonly DatabaseContext _context;
        private readonly ItemService _itemService;
        private readonly ItemFilterer _itemFilterer;
        private readonly FileHandlerService _fileHandlerService;
        private readonly ClusteringService _clusteringService;

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
            var pointsGroupModel = this._fileHandlerService.ConvertFileToPointsGroupModel(file);
            return (await this.AddPointsGroupInternalAsync(userId, pointsGroupModel).ConfigureAwait(false));
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
            => this._fileHandlerService.ConvertFileToPointsGroupModel(file);
        

        /// <summary>
        /// Persist a <see cref="PointsGroup"/> to the database. 
        /// </summary>
        public async Task<PointsGroupModel> SavePointsGroupAsync(int userId, PointsGroupModel pointsGroupModel)
            => await this.AddPointsGroupInternalAsync(userId, pointsGroupModel).ConfigureAwait(false);
        
        /// <summary>
        /// Create a <see cref="PointsGroup"/> and persist it to the database.
        /// </summary>
        /// <returns></returns>
        private async Task<PointsGroupModel> AddPointsGroupInternalAsync(int userId, PointsGroupModel pointsGroupModel)
        {
            var pointsGroup = ConvertToPointsGroup(pointsGroupModel);
            
            // create itemId for pointsGroup
            var itemId = await this._itemService.AddItemAsync(ItemType.PointsGroup, ItemPermissionType.Private);
            pointsGroup.ItemId = itemId;

            
            await this._context.PointsGroups.AddAsync(ConvertToPointsGroup(pointsGroupModel));
            await this._context.SaveChangesAsync();
            
            await this._context.UserItems.AddAsync(new UserItem {UserId = userId, ItemId = itemId});
            await this._context.SaveChangesAsync();

            pointsGroup.ClusteringOutputJson = JsonConvert.SerializeObject(this.GetCalculationOutputModel(pointsGroupModel.Points));
            
            this._context.Update(pointsGroupModel);
            await this._context.SaveChangesAsync();

            return this.GetPointsGroupModel(pointsGroup, this._context.Items.Single(i => i.ItemId == itemId));
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
        /// Used to get <see cref="PointsGroupModel"/> from a persisted <see cref="PointsGroup"/>.
        /// </summary>
        private PointsGroupModel GetPointsGroupModel(PointsGroup pointsGroup, Item item)
        {
            return new PointsGroupModel
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

        private static PointsGroup ConvertToPointsGroup(PointsGroupModel pointsGroupModel)
        {
            return new PointsGroup
            {
                PointsGroupId = pointsGroupModel.PointsGroupId,
                Name = pointsGroupModel.Name,
                Points = pointsGroupModel.Points,
                AverageHorizontalDisplacement = pointsGroupModel.AverageHorizontalDisplacement,
                AverageVerticalDisplacement = pointsGroupModel.AverageVerticalDisplacement,
                ClusteringOutputJson = JsonConvert.SerializeObject(pointsGroupModel.CalculationOutput.ClusteringSummaries)
            };
        }

        private CalculationOutputModel GetCalculationOutputModel(IReadOnlyList<PointModel> points)
        {
            var clusteringOutput = this._clusteringService.GetCalculationOutput(points);
            
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
                ClusteringSummaries = clusteringOutput.ClusteringSummaries.Select(GetClusteringSummaryModel)
            };
        }
        
        private static ClusteringSummaryModel GetClusteringSummaryModel(ClusteringSummary clusteringSummary)
        {
            return new ClusteringSummaryModel()
            {
                ClusterCount = clusteringSummary.ClusterCount,
                InterclusterDistance = clusteringSummary.InterclusterDistance.ToMask(),
                IntraclusterDistances = clusteringSummary.IntraclusterDistances.Select(icd =>
                    new IntraclusterDistanceModel()
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