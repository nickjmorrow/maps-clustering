using System.Collections.Generic;
using Calc.Models;

namespace WebApplication.Models
{
    public class DbscanConfig
    {
        public IEnumerable<Point> Points { get; set; }
        public int MinimumPointsPerCluster { get; set; }
        public int MaximumDistanceBetweenPoints { get; set; }
    }
}