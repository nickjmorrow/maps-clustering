using System.Collections.Generic;

namespace Calc.Models
{
    public class CalculationOutput
    {
        public IEnumerable<OrderedPoint> OrderedPoints { get; set; }
        public IEnumerable<ClusteringSummary> ClusteringSummaries { get; set; }
    }
}