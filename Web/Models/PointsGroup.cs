using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Web.Models;
using WebApplication.Models.DTOs;

namespace WebApplication.Models
{
    [Table("pointsGroups", Schema="dbo")]
    public class PointsGroup : IItemBound
    {
        [Key]
        public int PointsGroupId { get; set; }
        public string Name { get; set; }
        public int ItemId { get; set; }

        public IEnumerable<Point> Points { get; set; }
    }
}