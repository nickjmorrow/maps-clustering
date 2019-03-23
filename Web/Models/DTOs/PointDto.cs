using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace WebApplication.Models.DTOs
{
    [Table("points", Schema="dbo")]
    public class PointDto : Calc.Models.Point
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public override int PointId { get; set; }
        
        [ForeignKey("PointsGroup")]
        public int PointsGroupId { get; set; }
        
        public PointsGroup PointsGroup { get; set; }
    }
}