using System;
using Calc.Services;
using NUnit.Framework;

namespace CalcTests
{
    public class TourProviderTest
    {
        [Test]
        public void BaseTest()
        {
            var tourProvider = new TourProvider();
            var input = new int[][]
            {
                new int[] {0, 1, 15, 16},
                new int[] {2, 0, 7, 3},
                new int[] {9, 6, 0, 12},
                new int[] {10, 4, 8, 0}
            };

            var minCost = tourProvider.GetMinCost(input);

            Console.WriteLine(minCost);
        }
    }
}