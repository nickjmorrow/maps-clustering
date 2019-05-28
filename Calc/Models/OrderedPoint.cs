using System.Collections.Generic;
using Calc.Models.AgglomerativeHierarchicalClustering;

namespace Calc.Models
{
    public class OrderedPoint : Point
    {
        public IEnumerable<ClusterSnapshot> ClusterSnapshots { get; set; }
        public List<OrderingSnapshot> OrderingSnapshots { get; set; }
    }
}