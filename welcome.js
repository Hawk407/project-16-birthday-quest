(() => {
  const zone = 'Asia/Kolkata';
  const TEST_MODE = new URLSearchParams(window.location.search).get('test') === '1';
  const targetParts = { year: 2026, month: 11, day: 16, hour: 7, minute: 30, second: 0 };
  const mainMap = 'https://hawk407.github.io/project-16-birthday-quest/';
  const button = document.getElementById('enterButton');
  const countdown = document.getElementById('countdown');
  const label = document.getElementById('gateLabel');
  const note = document.getElementById('gateNote');

  // Build the unlock instant in IST without relying on the visitor's device timezone.
  const unlockUTC = Date.UTC(2026, 10, 16, 2, 0, 0); // 07:30 Asia/Kolkata
  const birthdayStartUTC = Date.UTC(2026, 10, 16, 0, 0, 0); // midnight Asia/Kolkata

  function istNowParts() {
    const parts = new Intl.DateTimeFormat('en-GB', {
      timeZone: zone, year: 'numeric', month: '2-digit', day: '2-digit',
      hour: '2-digit', minute: '2-digit', second: '2-digit', hourCycle: 'h23'
    }).formatToParts(new Date());
    return Object.fromEntries(parts.filter(p => p.type !== 'literal').map(p => [p.type, Number(p.value)]));
  }

  function tick() {
    const now = Date.now();
    const p = istNowParts();
    const isBirthday = p.year === 2026 && p.month === 11 && p.day === 16;

    if (TEST_MODE) {
      countdown.textContent = 'TEST MODE';
      label.textContent = 'THE PATH IS OPEN · TEST';
      button.disabled = false;
      button.innerHTML = 'TEST THE MAP TRANSITION <span>↗</span>';
      note.textContent = 'Testing only — the real button still unlocks at 7:30 AM IST on 16 November.';
      return;
    }

    if (now >= unlockUTC && isBirthday) {
      countdown.textContent = 'THE PATH IS OPEN';
      label.textContent = 'YOUR FIRST ADVENTURE AWAITS';
      button.disabled = false;
      button.innerHTML = 'STEP INTO YOUR BIRTHDAY QUEST <span>↗</span>';
      note.textContent = 'The map is yours, explorer. Your first chapter opens at 8:30 AM.';
      return;
    }

    button.disabled = true;
    button.textContent = 'THE MAP IS STILL WAKING UP ✧';
    if (isBirthday && now >= birthdayStartUTC) {
      label.textContent = 'THE ADVENTURE BEGINS AT 7:30 AM';
      let seconds = Math.max(0, Math.floor((unlockUTC - now) / 1000));
      const hh = String(Math.floor(seconds / 3600)).padStart(2, '0');
      const mm = String(Math.floor((seconds % 3600) / 60)).padStart(2, '0');
      const ss = String(seconds % 60).padStart(2, '0');
      countdown.textContent = `${hh}:${mm}:${ss}`;
      note.textContent = 'Rest a little, birthday girl. Your map opens at 7:30 AM IST.';
    } else {
      label.textContent = 'A LITTLE BIRTHDAY MAGIC IS ON ITS WAY';
      countdown.textContent = '16 · 11 · 2026';
      note.textContent = 'Come back on your birthday. The map unlocks at 7:30 AM IST.';
    }
  }

  button.addEventListener('click', () => {
    if (!button.disabled) window.location.href = mainMap;
  });
  tick();
  setInterval(tick, 1000);
})();
