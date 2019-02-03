using System.Collections.Generic;
using System.Linq;
using Calc.Models;
using Calc.Models.AgglomerativeHierarchicalClustering;

namespace Calc
{
    public class ClusterSummaryService
    {
        public IEnumerable<ClusterSummary> GetClusterSummaries(IEnumerable<AgglomerativeHierarchicalClusterPoint> ahcPoints)
        {
            foreach (var ahcPoint in ahcPoints)
            {
                var clusterSummary = new ClusterSummary()
                {
                    // TODO
                };
            }
            var clusters = ahcPoints.Select(p =>
            {
                p.AgglomerativeHierarchicalClusterInfos.Select(ci =>
                {
                    ci.
                })
            });
        }
    }
}