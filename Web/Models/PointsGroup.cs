using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace WebApplication.Models
{
    [Table("pointsGroups", Schema="dbo")]
    public class PointsGroup
    {
        [Key]
        public int PointsGroupId { get; set; }
        public string Name { get; set; }
        public int ItemId { get; set; }
    }
}