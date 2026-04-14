/**
 * Demo Seed Data
 */

import { randomUUID } from "crypto";

/**
 * Demo Trainer
 * Must match a real trainers.id row later
 */
export const demoTrainerId = "d5b9715f-1bf2-447a-bfe1-dfd5e33c6faf";

/**
 * Stable IDs
 */
export const clientIds = {
  max: "22222222-2222-2222-2222-222222222221",
  luna: "22222222-2222-2222-2222-222222222222",
};

export const templateIds = {
  puppy: "33333333-3333-3333-3333-333333333331",
  leash: "33333333-3333-3333-3333-333333333332",
  reactivity: "33333333-3333-3333-3333-333333333333",
};

export const sessionIds = {
  max1: "44444444-4444-4444-4444-444444444441",
  max2: "44444444-4444-4444-4444-444444444442",
  max3: "44444444-4444-4444-4444-444444444443",
  luna1: "44444444-4444-4444-4444-444444444444",
  luna2: "44444444-4444-4444-4444-444444444445",
};

/**
 * Date Helpers
 */
const now = new Date();

export const daysAgo = (days: number, hour = 12): string => {
  const date = new Date(now);
  date.setDate(date.getDate() - days);
  date.setHours(hour, 0, 0, 0);
  return date.toISOString();
};

export const hoursAgo = (hours: number): string => {
  const date = new Date(now);
  date.setHours(date.getHours() - hours);
  return date.toISOString();
};

/**
 * Clients
 */
export const clientsSeed = [
  {
    id: clientIds.max,
    trainer_id: demoTrainerId,
    owner_name: "Sarah Martinez",
    dog_name: "Max",
    dog_photo_url: "/demo/dogs/max.jpg",
    phone: "555-1101",
    created_at: daysAgo(21),
    archived_at: null,
  },
  {
    id: clientIds.luna,
    trainer_id: demoTrainerId,
    owner_name: "James Carter",
    dog_name: "Luna",
    dog_photo_url: "/demo/dogs/luna.jpg",
    phone: "555-1102",
    created_at: daysAgo(12),
    archived_at: null,
  },
];

/**
 * Homework Templates
 */
export const homeworkTemplatesSeed = [
  {
    id: templateIds.puppy,
    trainer_id: demoTrainerId,
    title: "Puppy Foundations: Focus & Manners",
    description:
      "Teaching your puppy that listening to you is the most rewarding game in the world.",
    link_url: "https://example.com/puppy-foundations",
    created_at: daysAgo(28),
    dog_note:
      "Puppies have tiny attention spans. Keep sessions under 3 minutes and always end while they are still excited to play!",
    steps_new: [
      "The 'Yes' Game: Say 'Yes!' in a happy voice and immediately give a treat. Repeat 10x.",
      "Name Response: Say their name. As soon as they look at you, say 'Yes!' and reward.",
      "Default Sit: Stand still and wait. When they sit without being asked, 'Yes!' and treat.",
      "The Quiet Zone: Practice 5 minutes of 'doing nothing' on a leash or in their playpen.",
    ],
    steps: ["The 'Yes' Game", "Name Response", "Default Sit", "The Quiet Zone"],
  },
  {
    id: templateIds.leash,
    trainer_id: demoTrainerId,
    title: "Loose Leash Walking: The Sweet Spot",
    description: "Teaching your dog that walking right next to your leg is the best place to be.",
    link_url: "https://example.com/loose-leash-walking",
    created_at: daysAgo(25),
    dog_note:
      "If the leash gets tight, stop walking immediately. We only move forward when the leash is hanging in a 'U' shape.",
    steps_new: [
      "Reward the Position: While standing still, give 5 treats in a row right at your pant seam.",
      "The First Step: Take one step. If they stay with you, say 'Yes!' and treat at your hip.",
      "Follow the Leader: Walk 5 steps. If they pull, change direction and walk the other way.",
      "Tension Release: If they pull, wait for them to look back at you before moving again.",
    ],
    steps: ["Reward the Position", "The First Step", "Follow the Leader", "Tension Release"],
  },
  {
    id: templateIds.reactivity,
    trainer_id: demoTrainerId,
    title: "Reactivity: Calm Observations",
    description: "Helping your dog feel safe and relaxed when they see other dogs or people.",
    link_url: "https://example.com/reactivity-follow-up",
    created_at: daysAgo(20),
    dog_note:
      "Distance is safety. If your dog is barking or lunging, you are too close. Move away until they can focus on you again.",
    steps_new: [
      "Find the Safe Zone: Stand far enough away that your dog sees the 'trigger' but stays calm.",
      "Look and Dismiss: When your dog looks at the other dog, say 'Yes!' and give a treat.",
      "The Happy U-Turn: If you see a trigger coming toward you, say 'Let's go!' and walk away.",
      "Treat Scatters: Drop a handful of treats in the grass to encourage sniffing and calming down.",
    ],
    steps: ["Find the Safe Zone", "Look and Dismiss", "The Happy U-Turn", "Treat Scatters"],
  },
];

/**
 * Sessions
 */
export const sessionsSeed = [
  {
    id: sessionIds.max1,
    client_id: clientIds.max,
    trainer_id: demoTrainerId,
    session_number: 1,
    summary:
      "Introduced marker timing, place work, and calm doorway reps. Max was much more thoughtful once the reps stayed short and clear.",
    token: "demo-max-session-1",
    sent_at: daysAgo(16, 15),
    created_at: daysAgo(16, 14),
    first_viewed_at: daysAgo(16, 18),
    last_viewed_at: daysAgo(15, 20),
    view_count: 3,
    last_message_at: daysAgo(15, 21),
  },
  {
    id: sessionIds.max2,
    client_id: clientIds.max,
    trainer_id: demoTrainerId,
    session_number: 2,
    summary:
      "Built on place duration and introduced driveway leash work. Max is checking in better, but guest arrivals are still his hardest trigger.",
    token: "demo-max-session-2",
    sent_at: daysAgo(9, 15),
    created_at: daysAgo(9, 14),
    first_viewed_at: daysAgo(9, 17),
    last_viewed_at: daysAgo(8, 19),
    view_count: 4,
    last_message_at: daysAgo(8, 20),
  },
  {
    id: sessionIds.max3,
    client_id: clientIds.max,
    trainer_id: demoTrainerId,
    session_number: 3,
    summary:
      "Focused on front-door calm, leash pressure response, and adding more real-life distractions without losing engagement.",
    token: "demo-max-session-3",
    sent_at: daysAgo(2, 16),
    created_at: daysAgo(2, 15),
    first_viewed_at: daysAgo(2, 18),
    last_viewed_at: hoursAgo(10),
    view_count: 2,
    last_message_at: hoursAgo(8),
  },
  {
    id: sessionIds.luna1,
    client_id: clientIds.luna,
    trainer_id: demoTrainerId,
    session_number: 1,
    summary:
      "Started engagement work, name response, and leash pressure basics. Luna did best once distractions were kept low and the pace stayed slow.",
    token: "demo-luna-session-1",
    sent_at: daysAgo(7, 15),
    created_at: daysAgo(7, 14),
    first_viewed_at: daysAgo(7, 18),
    last_viewed_at: daysAgo(6, 19),
    view_count: 2,
    last_message_at: daysAgo(6, 21),
  },
  {
    id: sessionIds.luna2,
    client_id: clientIds.luna,
    trainer_id: demoTrainerId,
    session_number: 2,
    summary:
      "Reviewed driveway walking and added mat settle work. Luna is showing better check-ins, but the sidewalk is still too much right now.",
    token: "demo-luna-session-2",
    sent_at: daysAgo(1, 16),
    created_at: daysAgo(1, 15),
    first_viewed_at: daysAgo(1, 19),
    last_viewed_at: hoursAgo(6),
    view_count: 1,
    last_message_at: hoursAgo(4),
  },
];

/**
 * Homework Items
 */
export const homeworkItemsSeed = [
  {
    id: randomUUID(),
    session_id: sessionIds.max1,
    template_id: templateIds.puppy,
    title: "The 'Yes' Game",
    description: "Say 'Yes!' and immediately reward. Repeat for 10 reps.",
    link_url: null,
    dog_note: "Keep it upbeat and end before he loses interest.",
    steps: [
      "Have 10 small treats ready before you start.",
      "Say 'Yes!' in a happy voice.",
      "Immediately give Max a treat after each marker.",
      "Repeat for 10 clean reps, then stop while he still wants more.",
    ],
    is_checked: true,
    checked_at: daysAgo(15, 19),
    created_at: daysAgo(16, 14),
  },
  {
    id: randomUUID(),
    session_id: sessionIds.max1,
    template_id: templateIds.puppy,
    title: "Name Response",
    description: "Say 'Max' once. Reward the moment he turns toward you.",
    link_url: null,
    dog_note: "Only say his name once per rep.",
    steps: [
      "Wait until Max is mildly distracted but still able to respond.",
      "Say 'Max' one time in a calm, clear voice.",
      "The moment he looks at you, mark and reward.",
      "Reset and repeat for 5 to 8 reps.",
    ],
    is_checked: true,
    checked_at: daysAgo(15, 19),
    created_at: daysAgo(16, 14),
  },
  {
    id: randomUUID(),
    session_id: sessionIds.max1,
    template_id: templateIds.puppy,
    title: "The Quiet Zone",
    description: "Practice a few calm minutes on leash with no active training.",
    link_url: null,
    dog_note: "The goal is relaxation, not obedience.",
    steps: [
      "Choose a calm area inside the house.",
      "Keep Max on leash next to you without asking for commands.",
      "Reward quiet, relaxed behavior every so often.",
      "End after a few calm minutes before he gets restless.",
    ],
    is_checked: false,
    checked_at: null,
    created_at: daysAgo(16, 14),
  },

  {
    id: randomUUID(),
    session_id: sessionIds.max2,
    template_id: templateIds.leash,
    title: "Reward the Position",
    description: "Pay Max at your leg so the sweet spot stays valuable.",
    link_url: null,
    dog_note: "Deliver the reward exactly where you want him.",
    steps: [
      "Stand still with Max on your left side.",
      "When he is next to your leg, mark and reward at your pant seam.",
      "Reset between reps instead of feeding continuously.",
      "Do 5 to 10 reps before adding movement.",
    ],
    is_checked: true,
    checked_at: daysAgo(8, 18),
    created_at: daysAgo(9, 14),
  },
  {
    id: randomUUID(),
    session_id: sessionIds.max2,
    template_id: templateIds.leash,
    title: "Follow the Leader",
    description: "Walk short reps and change direction when he gets pushy.",
    link_url: null,
    dog_note: "Keep it smooth. Don’t drag him through the rep.",
    steps: [
      "Start in the driveway or another low-distraction area.",
      "Walk 5 to 10 steps while rewarding check-ins.",
      "If Max forges ahead, calmly turn and go the other direction.",
      "Keep reps short and successful.",
    ],
    is_checked: true,
    checked_at: daysAgo(8, 18),
    created_at: daysAgo(9, 14),
  },
  {
    id: randomUUID(),
    session_id: sessionIds.max2,
    template_id: templateIds.leash,
    title: "Tension Release",
    description: "Pause when the leash tightens and reward the choice to reconnect.",
    link_url: null,
    dog_note: "Patience matters more than distance here.",
    steps: [
      "The moment the leash gets tight, stop moving.",
      "Wait quietly for Max to soften or look back toward you.",
      "Mark and reward the reconnect instead of pulling him back.",
      "Resume walking only after the leash relaxes.",
    ],
    is_checked: false,
    checked_at: null,
    created_at: daysAgo(9, 14),
  },

  {
    id: randomUUID(),
    session_id: sessionIds.max3,
    template_id: templateIds.reactivity,
    title: "Find the Safe Zone",
    description: "Work far enough from the trigger that Max can still think.",
    link_url: null,
    dog_note: "Distance is what keeps the rep productive.",
    steps: [
      "Start farther away than you think you need.",
      "Watch Max for soft body language and ability to take food.",
      "If he stiffens, stares, or vocalizes, add more distance.",
      "Stay only where he can notice the trigger and remain workable.",
    ],
    is_checked: true,
    checked_at: hoursAgo(12),
    created_at: daysAgo(2, 15),
  },
  {
    id: randomUUID(),
    session_id: sessionIds.max3,
    template_id: templateIds.reactivity,
    title: "Look and Dismiss",
    description: "Mark the moment he notices the trigger and can still disengage.",
    link_url: null,
    dog_note: "Pay before the bark, not after it.",
    steps: [
      "Let Max notice the trigger from a safe distance.",
      "The second he looks calmly, mark.",
      "Reward as he turns back to you or softens his body.",
      "Repeat only while he stays under threshold.",
    ],
    is_checked: false,
    checked_at: null,
    created_at: daysAgo(2, 15),
  },
  {
    id: randomUUID(),
    session_id: sessionIds.max3,
    template_id: templateIds.reactivity,
    title: "The Happy U-Turn",
    description: "Use a cheerful exit before he tips over threshold.",
    link_url: null,
    dog_note: "The goal is smooth exits, not toughing it out.",
    steps: [
      "Say your exit phrase in a light, upbeat voice.",
      "Turn away before Max escalates.",
      "Reward him for moving with you.",
      "Practice the turn before you actually need it in a hard moment.",
    ],
    is_checked: false,
    checked_at: null,
    created_at: daysAgo(2, 15),
  },

  {
    id: randomUUID(),
    session_id: sessionIds.luna1,
    template_id: templateIds.puppy,
    title: "Name Response",
    description: "Reward the instant Luna turns to you after hearing her name.",
    link_url: null,
    dog_note: "One cue, then wait.",
    steps: [
      "Choose a quiet room with minimal distractions.",
      "Say 'Luna' one time in a warm, clear voice.",
      "Mark and reward the second she turns toward you.",
      "Do 5 to 8 reps and stop while she is still engaged.",
    ],
    is_checked: true,
    checked_at: daysAgo(6, 18),
    created_at: daysAgo(7, 14),
  },
  {
    id: randomUUID(),
    session_id: sessionIds.luna1,
    template_id: templateIds.puppy,
    title: "Default Sit",
    description: "Reward the choice to sit calmly without being asked.",
    link_url: null,
    dog_note: "Catch it naturally instead of luring it.",
    steps: [
      "Stand still with Luna near you and wait her out.",
      "The moment she offers a sit on her own, mark and reward.",
      "Reset by moving a step or two and waiting again.",
      "Reward calm choices, not frantic guessing.",
    ],
    is_checked: false,
    checked_at: null,
    created_at: daysAgo(7, 14),
  },
  {
    id: randomUUID(),
    session_id: sessionIds.luna1,
    template_id: templateIds.puppy,
    title: "The Quiet Zone",
    description: "Practice calm settling in a low-distraction spot inside.",
    link_url: null,
    dog_note: "This is about nervous system recovery.",
    steps: [
      "Choose a quiet corner or mat inside the home.",
      "Sit with Luna nearby without asking for active work.",
      "Reward small moments of calm breathing or relaxed posture.",
      "Keep the session short and end before she gets fussy.",
    ],
    is_checked: false,
    checked_at: null,
    created_at: daysAgo(7, 14),
  },

  {
    id: randomUUID(),
    session_id: sessionIds.luna2,
    template_id: templateIds.leash,
    title: "The First Step",
    description: "Take one clean step and reward if Luna stays connected.",
    link_url: null,
    dog_note: "Keep it easy enough that she can succeed often.",
    steps: [
      "Wait for Luna to settle next to your leg.",
      "Take one slow step forward.",
      "If she stays with you, mark and reward immediately.",
      "If she surges ahead, reset and try again.",
    ],
    is_checked: true,
    checked_at: hoursAgo(8),
    created_at: daysAgo(1, 15),
  },
  {
    id: randomUUID(),
    session_id: sessionIds.luna2,
    template_id: templateIds.leash,
    title: "Reward the Position",
    description: "Build value next to your leg before adding more distance.",
    link_url: null,
    dog_note: "Pay often while she is still learning the picture.",
    steps: [
      "Stand still with Luna on your left side.",
      "Reward right at your leg instead of out in front.",
      "Repeat 5 clean reps before moving.",
      "Stop while she is still focused and successful.",
    ],
    is_checked: false,
    checked_at: null,
    created_at: daysAgo(1, 15),
  },
  {
    id: randomUUID(),
    session_id: sessionIds.luna2,
    template_id: templateIds.leash,
    title: "Follow the Leader",
    description: "Use short driveway reps and reset before she gets overstimulated.",
    link_url: null,
    dog_note: "Driveway only for now.",
    steps: [
      "Walk 5 to 10 steps in the driveway.",
      "Reward every few steps while Luna stays connected.",
      "Turn and reset before she loses focus.",
      "End the rep before the environment feels too hard.",
    ],
    is_checked: false,
    checked_at: null,
    created_at: daysAgo(1, 15),
  },
];

/**
 * Session Messages
 */
export const sessionMessagesSeed = [
  {
    id: randomUUID(),
    session_id: sessionIds.max1,
    sender_type: "trainer",
    body: "Max did great today once we slowed everything down. Keep the sessions short and fun this week.",
    created_at: daysAgo(16, 16),
    updated_at: daysAgo(16, 16),
    read_at: daysAgo(16, 18),
  },
  {
    id: randomUUID(),
    session_id: sessionIds.max1,
    sender_type: "client",
    body: "He was much more focused tonight. The door work is still the hardest part when people come over.",
    created_at: daysAgo(15, 20),
    updated_at: daysAgo(15, 20),
    read_at: daysAgo(15, 21),
  },
  {
    id: randomUUID(),
    session_id: sessionIds.max1,
    sender_type: "trainer",
    body: "That’s normal. Keep the reps easy and reward before he gets too amped up.",
    created_at: daysAgo(15, 21),
    updated_at: daysAgo(15, 21),
    read_at: daysAgo(15, 21),
  },

  {
    id: randomUUID(),
    session_id: sessionIds.max2,
    sender_type: "trainer",
    body: "Nice progress today. He’s starting to understand that staying with you is what makes the walk keep moving.",
    created_at: daysAgo(9, 16),
    updated_at: daysAgo(9, 16),
    read_at: daysAgo(9, 17),
  },
  {
    id: randomUUID(),
    session_id: sessionIds.max2,
    sender_type: "client",
    body: "The driveway is going better. Front door excitement is still a challenge when guests show up.",
    created_at: daysAgo(8, 19),
    updated_at: daysAgo(8, 19),
    read_at: daysAgo(8, 20),
  },
  {
    id: randomUUID(),
    session_id: sessionIds.max2,
    sender_type: "trainer",
    body: "Totally expected. Keep the guest work simple and don’t stack too much difficulty at once.",
    created_at: daysAgo(8, 20),
    updated_at: daysAgo(8, 20),
    read_at: daysAgo(8, 20),
  },

  {
    id: randomUUID(),
    session_id: sessionIds.max3,
    sender_type: "trainer",
    body: "This week is all about calmer observations and cleaner exits before Max gets too wound up.",
    created_at: daysAgo(2, 16),
    updated_at: daysAgo(2, 16),
    read_at: daysAgo(2, 18),
  },
  {
    id: randomUUID(),
    session_id: sessionIds.max3,
    sender_type: "client",
    body: "He’s doing better at the door, but the front window is still where he loses it fastest.",
    created_at: hoursAgo(9),
    updated_at: hoursAgo(9),
    read_at: hoursAgo(8),
  },
  {
    id: randomUUID(),
    session_id: sessionIds.max3,
    sender_type: "trainer",
    body: "That’s helpful. Give yourself more distance from the window and pay him for noticing before he escalates.",
    created_at: hoursAgo(8),
    updated_at: hoursAgo(8),
    read_at: hoursAgo(8),
  },

  {
    id: randomUUID(),
    session_id: sessionIds.luna1,
    sender_type: "trainer",
    body: "Luna did much better once we reduced the distractions. Keep it simple and build confidence first.",
    created_at: daysAgo(7, 16),
    updated_at: daysAgo(7, 16),
    read_at: daysAgo(7, 18),
  },
  {
    id: randomUUID(),
    session_id: sessionIds.luna1,
    sender_type: "client",
    body: "She’s way more successful in the driveway than on the sidewalk right now.",
    created_at: daysAgo(6, 20),
    updated_at: daysAgo(6, 20),
    read_at: daysAgo(6, 21),
  },
  {
    id: randomUUID(),
    session_id: sessionIds.luna1,
    sender_type: "trainer",
    body: "Perfect. Stay there for now. I’d rather have easy wins than push her too fast.",
    created_at: daysAgo(6, 21),
    updated_at: daysAgo(6, 21),
    read_at: daysAgo(6, 21),
  },

  {
    id: randomUUID(),
    session_id: sessionIds.luna2,
    sender_type: "trainer",
    body: "Good work today. Keep the driveway reps short and use the mat afterward to help her settle.",
    created_at: daysAgo(1, 16),
    updated_at: daysAgo(1, 16),
    read_at: daysAgo(1, 19),
  },
  {
    id: randomUUID(),
    session_id: sessionIds.luna2,
    sender_type: "client",
    body: "She’s checking in more now, but the sidewalk still feels a little too busy for her.",
    created_at: hoursAgo(5),
    updated_at: hoursAgo(5),
    read_at: hoursAgo(4),
  },
  {
    id: randomUUID(),
    session_id: sessionIds.luna2,
    sender_type: "trainer",
    body: "That’s okay. Don’t rush the environment change. Repetition in the easy zone is still real progress.",
    created_at: hoursAgo(4),
    updated_at: hoursAgo(4),
    read_at: hoursAgo(4),
  },
];
