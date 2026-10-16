namespace KararOS.Application.DTOs.Streak;

public class StreakDto
{
    public int CurrentStreak { get; set; }
    public int LongestStreak { get; set; }
    public string? LastActiveDate { get; set; }
    public bool IsActiveToday { get; set; }
}
