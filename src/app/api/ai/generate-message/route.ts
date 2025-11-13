import { NextRequest, NextResponse } from 'next/server';

// Tone descriptions for system prompts
const toneDescriptions: Record<string, string> = {
  chill_bro: "You're a Gen Z friend who talks like 'bro', 'bestie', uses emojis, and is chill but will call them out. Use slang like 'lock in', 'no cap', 'fr', 'deadass'.",
  asian_dad: "You're an Asian dad who speaks in broken English, is direct, and uses phrases like 'why you not', 'you finish', 'come back'. Be strict but caring.",
  drill_sergeant: "You're a drill sergeant who is loud, commanding, and uses military-style language. Be intense and demanding.",
  gen_z: "You're the most Gen Z person ever. Use current slang, references, and be extremely relatable. Use 'lowkey', 'highkey', 'periodt', 'slay', etc.",
  therapist: "You're a supportive therapist who is understanding but firm. Use phrases like 'I understand', 'let's work through this', 'you've got this'."
};

function buildSystemPrompt(tone: string, isPG: boolean): string {
  const toneDescription = toneDescriptions[tone] || toneDescriptions.chill_bro;
  
  const pgNote = isPG 
    ? "Keep it PG - no cursing, no profanity." 
    : "You can use mild to moderate cursing that escalates with anger level. Level 0-1: no cursing, Level 2-3: light cursing (damn, hell), Level 4: moderate cursing (shit, ass), Level 5: stronger cursing (fuck, but keep it contextual).";
  
  return `You are róki, an unhinged productivity accountability buddy. ${toneDescription}

${pgNote}

Rules:
- Keep messages SHORT (max 2 sentences, under 100 characters)
- Be personal and direct
- Match the escalation level (0=chill, 1=warning, 2=annoyed, 3=angry, 4=furious)
- Use the task title naturally in the message
- Be authentic to the tone
- No quotes or extra formatting, just the message text`;
}

function buildUserPrompt(
  taskTitle: string | null,
  taskDescription: string | null,
  hoursOverdue: number,
  escalationLevel: number,
  streak: number,
  missedDays: number,
  totalTasksCompleted: number
): string {
  let prompt = "Generate a notification message for róki.\n\n";
  
  if (taskTitle) {
    prompt += `Task: ${taskTitle}\n`;
    if (taskDescription) {
      prompt += `Description: ${taskDescription}\n`;
    }
  } else {
    prompt += "Context: User is scrolling/wasting time instead of doing tasks\n";
  }
  
  if (hoursOverdue > 0) {
    prompt += `Hours overdue: ${hoursOverdue}\n`;
  }
  
  prompt += `Escalation level: ${escalationLevel} (0=chill, 1=warning, 2=annoyed, 3=angry, 4=furious)\n`;
  
  if (streak > 0) {
    prompt += `User streak: ${streak} days\n`;
  }
  
  if (missedDays > 0) {
    prompt += `User missed ${missedDays} days\n`;
  }
  
  if (totalTasksCompleted > 0) {
    prompt += `Total tasks completed: ${totalTasksCompleted}\n`;
  }
  
  prompt += "\nGenerate a short, personalized notification message (just the text, no quotes).";
  
  return prompt;
}

export async function POST(request: NextRequest) {
  try {
    // Get OpenRouter API key from environment
    const openRouterApiKey = process.env.OPENROUTER_API_KEY;
    
    if (!openRouterApiKey) {
      return NextResponse.json(
        { message: 'OpenRouter API key not configured' },
        { status: 500 }
      );
    }
    
    // Parse request body
    const body = await request.json();
    const {
      tone,
      taskTitle,
      taskDescription,
      hoursOverdue,
      escalationLevel,
      isPG,
      streak,
      missedDays,
      totalTasksCompleted
    } = body;
    
    // Validate required fields
    if (!tone) {
      return NextResponse.json(
        { message: 'Tone is required' },
        { status: 400 }
      );
    }
    
    // Build prompts
    const systemPrompt = buildSystemPrompt(tone, isPG ?? true);
    const userPrompt = buildUserPrompt(
      taskTitle || null,
      taskDescription || null,
      hoursOverdue || 0,
      escalationLevel || 0,
      streak || 0,
      missedDays || 0,
      totalTasksCompleted || 0
    );
    
    // Call OpenRouter API
    const openRouterResponse = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openRouterApiKey}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': 'https://roki.app',
        'X-Title': 'róki'
      },
      body: JSON.stringify({
        model: 'google/gemini-flash-1.5', // Best balance of cost and quality
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        temperature: 0.8,
        max_tokens: 100
      })
    });
    
    if (!openRouterResponse.ok) {
      const errorData = await openRouterResponse.text();
      console.error('OpenRouter API error:', errorData);
      return NextResponse.json(
        { message: 'Failed to generate AI message' },
        { status: 500 }
      );
    }
    
    const data = await openRouterResponse.json();
    const message = data.choices?.[0]?.message?.content?.trim();
    
    if (!message) {
      return NextResponse.json(
        { message: 'Invalid response from AI' },
        { status: 500 }
      );
    }
    
    return NextResponse.json({ message });
    
  } catch (error: any) {
    console.error('Error generating AI message:', error);
    return NextResponse.json(
      { message: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

