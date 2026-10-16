using Microsoft.EntityFrameworkCore;
using KararOS.Application.Common.Interfaces;
using KararOS.Application.DTOs.Streak;
using KararOS.Application.Services.Interfaces;

namespace KararOS.Application.Services;

public class StreakService : IStreakService
{
    private readonly IKararDbContext _context;

    public StreakService(IKararDbContext context)
    {
        _context = context;
    }

    private static string GetTodayStr() => DateTime.UtcNow.ToString("yyyy-MM-dd");

    private static string GetYesterdayStr() => DateTime.UtcNow.AddDays(-1).ToString("yyyy-MM-dd");

    public async Task<StreakDto> GetStreakAsync(Guid userId, CancellationToken cancellationToken = default)
    {
        var user = await _context.Users.FirstOrDefaultAsync(u => u.Id == userId, cancellationToken);
        if (user == null)
        {
            throw new KeyNotFoundException("Kullanıcı bulunamadı.");
        }

        var today = GetTodayStr();
        var yesterday = GetYesterdayStr();
        var isActiveToday = user.LastActiveDate == today;

        int effectiveCurrentStreak = user.CurrentStreak;
        if (!isActiveToday && !string.IsNullOrEmpty(user.LastActiveDate))
        {
            // Eğer son aktif gün dünden daha eskiyse seri bozulmuştur
            if (user.LastActiveDate != yesterday)
            {
                effectiveCurrentStreak = 0;
            }
        }

        // Longest streak asla sıfırlanmaz ve currentStreak'ten küçük olamaz
        int effectiveLongestStreak = Math.Max(user.LongestStreak, effectiveCurrentStreak);

        return new StreakDto
        {
            CurrentStreak = effectiveCurrentStreak,
            LongestStreak = effectiveLongestStreak,
            LastActiveDate = user.LastActiveDate,
            IsActiveToday = isActiveToday
        };
    }

    public async Task<StreakDto> RecordActivityAsync(Guid userId, CancellationToken cancellationToken = default)
    {
        var user = await _context.Users.FirstOrDefaultAsync(u => u.Id == userId, cancellationToken);
        if (user == null)
        {
            throw new KeyNotFoundException("Kullanıcı bulunamadı.");
        }

        var today = GetTodayStr();
        var yesterday = GetYesterdayStr();

        // Zaten bugün kaydedildiyse tekrar artırma
        if (user.LastActiveDate == today)
        {
            return new StreakDto
            {
                CurrentStreak = user.CurrentStreak,
                LongestStreak = user.LongestStreak,
                LastActiveDate = user.LastActiveDate,
                IsActiveToday = true
            };
        }

        if (user.LastActiveDate == yesterday)
        {
            // Dün aktifti -> seriye devam!
            user.CurrentStreak += 1;
        }
        else
        {
            // Dünden daha önce aktifti veya ilk defa aktif -> 1'den başla
            user.CurrentStreak = 1;
        }

        user.LastActiveDate = today;

        // LongestStreak rekorunu koru ve güncelle
        if (user.CurrentStreak > user.LongestStreak)
        {
            user.LongestStreak = user.CurrentStreak;
        }

        await _context.SaveChangesAsync(cancellationToken);

        return new StreakDto
        {
            CurrentStreak = user.CurrentStreak,
            LongestStreak = user.LongestStreak,
            LastActiveDate = user.LastActiveDate,
            IsActiveToday = true
        };
    }
}
