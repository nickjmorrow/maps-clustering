using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Web.Models;
using WebApplication.Models.DTOs;

namespace WebApplication.Models
{
    [Table("points_groups", Schema="mc")]
    public class PointsGroup : IItemBound
    {
        [Key, Column("points_group_id")]
        public int PointsGroupId { get; set; }
        [Column("name")]
        public string Name { get; set; }
        [Column("average_horizontal_displacement")]
        public double AverageHorizontalDisplacement { get; set; }
        [Column("average_vertical_displacement")]
        public double AverageVerticalDisplacement { get; set; }
        [Column("item_id")]
        public int ItemId { get; set; }
        [Column("clustering_output_json")]
        public string ClusteringOutputJson { get; set; }
    }
}