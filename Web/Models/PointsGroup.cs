using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Web.Models;
using WebApplication.Enums;
using WebApplication.Models.DTOs;

namespace WebApplication.Models
{
    [Table("pointsGroups", Schema="mapClustering")]
    public class PointsGroup : IItemBound
    {
        [Key]
        public int PointsGroupId { get; set; }
        public string Name { get; set; }
        public double AverageHorizontalDisplacement { get; set; }
        public double AverageVerticalDisplacement { get; set; }
        public int ItemId { get; set; }
        public string ClusteringOutputJson { get; set; }
        
        public IReadOnlyList<PointModel> Points { get; set; }
    }
}