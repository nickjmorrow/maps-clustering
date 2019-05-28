using System.Collections.Generic;

namespace Calc.Models.AgglomerativeHierarchicalClustering
{
    public class ClusteredPoint : Point
    {
        public IEnumerable<ClusterSnapshot> ClusterSnapshots { get; set; }

        public ClusteredPoint()
        {
            this.ClusterSnapshots = new List<ClusterSnapshot>();
        }

        public ClusteredPoint GetShallowCopy()
        {
            return (ClusteredPoint) this.MemberwiseClone();
        }

        public override bool Equals(object obj)
        {
            var point = obj as Point;
            if (point == null)
            {
                return false;
            }
            return PointId == point.PointId;
        }

        public override int GetHashCode()
        {
            return base.GetHashCode();
        }
    }
}