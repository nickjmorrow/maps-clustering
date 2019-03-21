namespace Calc.Models
{
    public class IntraclusterDistance
    {
        public int ClusterId { get; set; }
        public double Distance { get; set; }
        
        public override bool Equals(object obj)
        {
            var intraclusterDistance = obj as IntraclusterDistance;
            if (intraclusterDistance == null)
            {
                return false;
            }

            return intraclusterDistance.ClusterId == this.ClusterId && 
                   intraclusterDistance.Distance == this.Distance;
        }
    
        public override int GetHashCode()
        {
            return base.GetHashCode();
        }
    }
    
}