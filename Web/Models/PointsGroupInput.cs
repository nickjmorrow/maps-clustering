using System.Collections.Generic;
using WebApplication.Models.DTOs;

namespace WebApplication.Controllers
{
    public class PointsGroupInput
    {
        public string Name { get; set; }
        public IEnumerable<Point> Points { get; set; }
    }
}