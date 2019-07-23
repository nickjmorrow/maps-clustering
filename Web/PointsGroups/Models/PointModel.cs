using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace WebApplication.Models.DTOs
{
    public class PointModel : Calc.Models.Point
    {
        public override int PointId { get; set; }
    }
}