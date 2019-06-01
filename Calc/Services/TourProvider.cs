using System;
using System.Collections.Generic;
using System.Linq;

namespace Calc.Services
{
    public class TourProvider
    {
        private readonly double[,] _adjacencyMatrix;
        private readonly IEnumerable<int> _vertices;


        public TourProvider(IEnumerable<int> vertices, double[,] matrix)
        {
            this._vertices = vertices;
            this._adjacencyMatrix = matrix;
        }

        public IEnumerable<int> Solve()
        {
            var startVertex = this._vertices.First();
            var set = new HashSet<int>(this._vertices);
            set.Remove(startVertex);

            var root = new Node();
            this.GetMinimumCostRoute(startVertex, set, root);
            return TraverseTree(root, startVertex);
        }

        private double GetMinimumCostRoute(int startVertex, HashSet<int> set, Node root)
        {
            if (!set.Any())
            {
                root.ChildNodes = new [] { new Node { Value = this._vertices.First(), Selected = true } };
                return _adjacencyMatrix[startVertex, 0];
            }

            var totalCost = double.MaxValue;
            var i = 0;
            var currentVertex = i;
            root.ChildNodes = new Node[set.Count()];

            foreach (var destination in set)
            {
                root.ChildNodes[i] = new Node { Value = destination };

                double costOfVistingCurrentNode = _adjacencyMatrix[startVertex, destination];

                var newSet = new HashSet<int>(set);
                newSet.Remove(destination);
                double costOfVisitingOtherNodes = GetMinimumCostRoute(destination, newSet, root.ChildNodes[i]);
                double currentCost = costOfVistingCurrentNode + costOfVisitingOtherNodes;

                if (totalCost > currentCost)
                {
                    totalCost = currentCost;
                    currentVertex = i;
                }

                i++;
            }

            root.ChildNodes[currentVertex].Selected = true;

            return totalCost;

        }

        private IEnumerable<int> TraverseTree(Node root, int startint)
        {
            var q = new Queue<int>();
            q.Enqueue(startint);
            TraverseTreeUtil(root, q);
            return q;
        }

        private void TraverseTreeUtil(Node root, Queue<int> vertices)
        {
            if (root.ChildNodes == null)
            {
                return;
            }

            foreach (var child in root.ChildNodes)
            {
                if (child.Selected)
                {
                    vertices.Enqueue(child.Value);
                    TraverseTreeUtil(child, vertices);
                }
            }
        }
    }
    
    public class Node
    {
        public int Value { get; set; }
        public Node[] ChildNodes { get; set; }
        public bool Selected { get; set; }
    }
}