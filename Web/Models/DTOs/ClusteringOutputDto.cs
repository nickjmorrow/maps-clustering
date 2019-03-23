using System.Collections.Generic;
using Calc.Models.AgglomerativeHierarchicalClustering;

namespace Web.Services
{
    public class ClusteringOutputDto
    {
        public IEnumerable<ClusteredPoint> ClusteredPoints { get; set; }
        public IEnumerable<ClusteringSummaryDto> ClusteringSummaries { get; set; } 
    }
}