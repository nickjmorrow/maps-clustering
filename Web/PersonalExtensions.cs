using System;

namespace WebApplication
{
    public static class PersonalExtensions
    {
        public static string ToMask(this Double num)
        {
            return num.ToMask(Constants.Mask, Constants.Unit);
        }

        public static string ToMask(this Double num, string mask, string unit)
        {
            return num.ToString(mask) + unit;
        }
    }
}