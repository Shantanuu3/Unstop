import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

// Smart message responses for marketplace and services
const smartResponses = {
  marketplace: {
    inquiry: [
      "Hi! I'm interested in this item. Is it still available?",
      "Hello! Could you tell me more about the condition of this item?",
      "Hi there! I'd like to know if you're willing to negotiate on the price?",
      "Hello! When would be a good time to see this item in person?",
      "Hi! Is this item still for sale? I'm very interested!",
    ],
    negotiate: [
      "Would you be willing to accept $[PRICE-10%] for this item?",
      "I'm interested but my budget is around $[PRICE-15%]. Would that work?",
      "Could you do $[PRICE-20%] if I pick it up today?",
      "I have cash ready. Would you take $[PRICE-10%]?",
    ],
    pickup: [
      "I can pick this up today if it's still available. What time works for you?",
      "I'm available this weekend for pickup. What's your schedule like?",
      "I can come by after work hours. Are you available in the evening?",
      "I'm flexible with timing. When would be convenient for you?",
    ]
  },
  services: {
    booking: [
      "Hi! I'm interested in booking your [SERVICE_NAME]. Are you available next week?",
      "Hello! I'd like to schedule a session. What's your availability like?",
      "Hi there! Could you tell me more about what's included in your [SERVICE_NAME]?",
      "I'd like to book your service. Do you have any openings this month?",
      "Hello! I'm interested in your [SERVICE_NAME]. What's the next available slot?",
    ],
    questions: [
      "How long does a typical [SERVICE_NAME] session take?",
      "Do you provide all the necessary equipment/materials?",
      "What's your cancellation policy if something comes up?",
      "Do you offer any package deals for multiple sessions?",
      "Can you work around my schedule? I have some time constraints.",
    ],
    location: [
      "Do you travel to the client's location or do we meet at your place?",
      "What area do you serve? I'm located in [NEIGHBORHOOD].",
      "Are there any additional charges for travel within the neighborhood?",
      "Is it possible to meet somewhere convenient for both of us?",
    ]
  }
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    const { type, category, itemData } = await req.json()

    let responses: string[] = []

    if (type === 'marketplace') {
      responses = [
        ...smartResponses.marketplace.inquiry,
        ...smartResponses.marketplace.negotiate.map(msg => 
          msg.replace('[PRICE-10%]', Math.round(itemData.price * 0.9).toString())
             .replace('[PRICE-15%]', Math.round(itemData.price * 0.85).toString())
             .replace('[PRICE-20%]', Math.round(itemData.price * 0.8).toString())
        ),
        ...smartResponses.marketplace.pickup
      ]
    } else if (type === 'services') {
      responses = [
        ...smartResponses.services.booking.map(msg => 
          msg.replace('[SERVICE_NAME]', itemData.name || 'service')
        ),
        ...smartResponses.services.questions.map(msg => 
          msg.replace('[SERVICE_NAME]', itemData.name || 'service')
        ),
        ...smartResponses.services.location
      ]
    }

    // Return 3 random responses
    const shuffled = responses.sort(() => 0.5 - Math.random())
    const selectedResponses = shuffled.slice(0, 3)

    return new Response(
      JSON.stringify({ responses: selectedResponses }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    console.error('Error generating smart responses:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )
  }
})