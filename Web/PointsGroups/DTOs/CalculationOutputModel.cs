using System.Collections.Generic;
using Calc.Models;
using Calc.Models.AgglomerativeHierarchicalClustering;

namespace Web.Services
{
    public class CalculationOutputModel
    {
        public IEnumerable<OrderedPoint> OrderedPoints { get; set; }
        public IEnumerable<ClusteringSummaryModel> ClusteringSummaries { get; set; }
    }
}