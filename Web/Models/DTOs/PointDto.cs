using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace WebApplication.Models.DTOs
{
    [Table("points", Schema="dbo")]
    public class Point : Calc.Models.Point
    {   
        [ForeignKey("PointsGroup")]
        public int PointsGroupId { get; set; }
        public PointsGroup PointsGroup { get; set; }
    }
}