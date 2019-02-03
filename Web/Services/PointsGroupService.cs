using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Calc;
using Calc.Models.AgglomerativeHierarchicalClustering;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using Newtonsoft.Json;
using Web.Models;
using WebApplication;
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
            this._context = context;
            this._itemService = itemService;
            this._itemFilterer = itemFilterer;
            this._fileHandlerService = fileHandlerService;
            this._ahcService = ahcService;
        }

        // TODO: should think in terms of 'points groups', and users can be permissioned to whole groups
        // it does'nt make sense to keep track of permissioning on a points-level
        
        // TODO: create has-many relationship between pointsGroup and points
        // be able to upload file and save it as a pointsGroup
        
        // TODO: let me upload a file to replace a pointsGroup
        
        // TODO: let me rename a pointsGroup
        
        // TODO: add tests here

        public IEnumerable<PointsGroupDTO> GetPointsGroups(int? userId)
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

        public async Task<PointsGroupDTO> AddPointsGroupAsync(int userId, IFormFile file)
        {
            var pointsGroup = this._fileHandlerService.ConvertFileToPointsGroup(file);
            return (await this.AddPointsGroupAsyncInternal(userId, pointsGroup));
        }

        /// <summary>
        /// Create a <see cref="PointsGroup"/> and persist it to the database.
        /// </summary>
        /// <returns></returns>
        public async Task<PointsGroupDTO> AddPointsGroupAsyncInternal(int userId, PointsGroup pointsGroup)
        {
            // create itemId for pointsGroup
            var itemId = await this._itemService.AddItemAsync((int) ItemType.PointsGroup);
            pointsGroup.ItemId = itemId;
            
            await this._context.PointsGroups.AddAsync(pointsGroup);
            await this._context.UserItems.AddAsync(new UserItem() {UserId = userId, ItemId = itemId});
            await this._context.SaveChangesAsync();

            pointsGroup.AhcInfoJson = JsonConvert.SerializeObject(new AhcInfo()
            {
                AhcPoints = this.GetAhcPoints(pointsGroup.Points)
            });
            
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
        /// Create a <see cref="PointsGroupDTO"/> from a file.
        /// </summary>
        public PointsGroupDTO CreatePointsGroupAsync(IFormFile file)
        {
            var pointsGroup = this._fileHandlerService.ConvertFileToPointsGroup(file);
            pointsGroup.Points = pointsGroup.Points.Select((p, i) =>
            {
                p.PointId = i + 1;
                return p;
            }).ToList();

            return this.GetPointsGroupDto(pointsGroup);
        }

        /// <summary>
        /// Persist a <see cref="PointsGroup"/> to the database. 
        /// </summary>
        public async Task<PointsGroupDTO> SavePointsGroupAsync(int userId, PointsGroupDTO pointsGroupDto)
        {
            var pointsGroup = new PointsGroup
            {
                Name = pointsGroupDto.Name,
                AverageHorizontalDisplacement = pointsGroupDto.AverageHorizontalDisplacement,
                AverageVerticalDisplacement = pointsGroupDto.AverageVerticalDisplacement,
                Points = pointsGroupDto.Points.Select(p => new Point
                    {
                        HorizontalDisplacement = p.HorizontalDisplacement,
                        VerticalDisplacement = p.VerticalDisplacement,
                        Name = p.Name
                    }
                ).ToList()
            };

            return (await this.AddPointsGroupAsyncInternal(userId, pointsGroup));
        }

        private IEnumerable<AhcPointDTO> GetAhcPoints(IEnumerable<Point> points)
        {
            var calcPoints = this.GetCalcPoints(points);
            var ahcPoints = this._ahcService.GetModel(calcPoints);
            return ahcPoints.Select(ahcp => new AhcPointDTO
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
        
        private IEnumerable<Point> FormatPoints(PointsGroup pointsGroup)
        {
            if (pointsGroup.PointsGroupId == null)
            {
                throw new ArgumentException(
                    $"Expected pointsGroup with name ${pointsGroup.Name} to have a pointsGroupId but was null.");
            }
            
            return pointsGroup.Points.Select((p, i) =>
            {
                return new Point()
                {
                    PointsGroupId = pointsGroup.PointsGroupId,
                    HorizontalDisplacement = p.HorizontalDisplacement,
                    VerticalDisplacement = p.VerticalDisplacement,
                    Name = p.Name
                };
            });
        }
        
        /// <summary>
        /// Used to get <see cref="PointsGroupDTO"/> from a persisted <see cref="PointsGroup"/>.
        /// </summary>
        private PointsGroupDTO GetPointsGroupDto(PointsGroup pointsGroup, Item item)
        {
            return new PointsGroupDTO()
            {
                PointsGroupId = pointsGroup.PointsGroupId,
                Name = pointsGroup.Name,
                Points = pointsGroup.Points,
                AverageHorizontalDisplacement = pointsGroup.AverageHorizontalDisplacement,
                AverageVerticalDisplacement = pointsGroup.AverageVerticalDisplacement,
                ItemPermissionType = item.ItemPermissionType,
                AhcInfo = JsonConvert.DeserializeObject<AhcInfo>(pointsGroup.AhcInfoJson)
            };
        }

        private IEnumerable<ClusterSummary> GetClusterSummaries(IEnumerable<AhcPointDTO> ahcPoints)
        {
            return new List<ClusterSummary> { };
        }

        private IEnumerable<InterClusterDistance> GetInterClusterDistances(IEnumerable<AhcPointDTO> ahcPoints)
        {
            return new List<InterClusterDistance> { };
        }
        
        /// <summary>
        /// Used to get <see cref="PointsGroupDTO"/> from <see cref="PointsGroup"/>
        /// that is not associated with a user and has not yet been persisted.
        /// </summary>
        private PointsGroupDTO GetPointsGroupDto(PointsGroup pointsGroup)
        {
            var ahcPoints = this.GetAhcPoints(pointsGroup.Points);
            return new PointsGroupDTO
            {
                Name = pointsGroup.Name,
                AverageHorizontalDisplacement = pointsGroup.AverageHorizontalDisplacement,
                AverageVerticalDisplacement = pointsGroup.AverageVerticalDisplacement,
                Points = pointsGroup.Points,
                ItemPermissionType = ItemPermissionType.Public,
                AhcInfo = new AhcInfo
                {
                    AhcPoints = ahcPoints,
                    ClusterSummaries = this.GetClusterSummaries(ahcPoints),
                    InterClusterDistances = this.GetInterClusterDistances(ahcPoints)
                }
            };
        }
    }
}