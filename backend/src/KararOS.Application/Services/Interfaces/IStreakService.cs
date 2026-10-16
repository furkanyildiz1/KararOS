using KararOS.Application.DTOs.Streak;

namespace KararOS.Application.Services.Interfaces;

public interface IStreakService
{
    Task<StreakDto> GetStreakAsync(Guid userId, CancellationToken cancellationToken = default);
    Task<StreakDto> RecordActivityAsync(Guid userId, CancellationToken cancellationToken = default);
}
