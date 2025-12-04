export const chapter1Data = {
    "chapter": {
        "id": "chapter_1",
        "title": "Where You've Been",
        "subtitle": "Your story so far",
        "estimatedMinutes": 4,
        "description": "Understanding your background helps us understand where you're going."
    },
    "variables": {
        "userName": {
            "type": "string",
            "default": "",
            "description": "User's preferred name"
        },
        "userAge": {
            "type": "number",
            "default": null,
            "description": "User's age in years"
        },
        "ageGroup": {
            "type": "string",
            "enum": [
                "young",
                "mid",
                "senior"
            ],
            "default": null,
            "description": "Derived age bracket: young (<35), mid (35-55), senior (55+)"
        },
        "employmentType": {
            "type": "string",
            "enum": [
                "employed",
                "self_employed",
                "retired",
                "transitioning",
                "other"
            ],
            "default": null,
            "description": "Primary employment status"
        },
        "occupation": {
            "type": "string",
            "default": "",
            "description": "Job title or description"
        },
        "employer": {
            "type": "string",
            "default": "",
            "description": "Employer name (if employed)"
        },
        "businessType": {
            "type": "string",
            "default": "",
            "description": "Type of business (if self-employed)"
        },
        "yearsInField": {
            "type": "number",
            "default": null,
            "description": "Years in current field"
        },
        "financialUpbringing": {
            "type": "string",
            "enum": [
                "tight",
                "comfortable",
                "privileged",
                "complicated"
            ],
            "default": null,
            "description": "How they describe their financial upbringing"
        },
        "previousAdvisorExperience": {
            "type": "string",
            "enum": [
                "yes",
                "no",
                "sort_of"
            ],
            "default": null,
            "description": "Whether they've worked with an advisor before"
        },
        "previousAdvisorType": {
            "type": "string",
            "default": "",
            "description": "Type of previous advisor (if sort_of)"
        },
        "advisorLiked": {
            "type": "string",
            "default": "",
            "description": "What they liked about previous advisor"
        },
        "advisorDisliked": {
            "type": "string",
            "default": "",
            "description": "What they didn't like about previous advisor"
        }
    },
    "nodes": [
        {
            "id": "welcome",
            "type": "ai_message",
            "speaker": "ai",
            "content": "Hi! I'm here to help you prepare for your first meeting with your advisor.\n\nThink of the next few minutes as a conversation — not a form. I'll ask questions, you share what feels right, and together we'll paint a picture of your financial life.\n\nLet's start at the beginning.",
            "nextNode": "ask_name",
            "delay": 2000
        },
        {
            "id": "ask_name",
            "type": "input",
            "speaker": "ai",
            "content": "What's your name, and what should I call you?",
            "inputType": "text",
            "placeholder": "Your preferred name",
            "validation": {
                "required": true,
                "minLength": 1,
                "maxLength": 50
            },
            "setsVariable": "userName",
            "nextNode": "greet_by_name"
        },
        {
            "id": "greet_by_name",
            "type": "ai_message",
            "speaker": "ai",
            "content": "Nice to meet you, {{userName}}! Let's learn a bit about you.",
            "nextNode": "ask_age",
            "delay": 1500
        },
        {
            "id": "ask_age",
            "type": "input",
            "speaker": "ai",
            "content": "How old are you?",
            "inputType": "number",
            "placeholder": "Your age",
            "helperText": "This helps us understand your timeline and life stage.",
            "validation": {
                "required": true,
                "min": 18,
                "max": 120
            },
            "setsVariable": "userAge",
            "computeVariable": {
                "name": "ageGroup",
                "logic": "userAge < 35 ? 'young' : userAge <= 55 ? 'mid' : 'senior'"
            },
            "conditionalNext": [
                {
                    "condition": "userAge < 35",
                    "nextNode": "age_response_young"
                },
                {
                    "condition": "userAge >= 35 && userAge <= 55",
                    "nextNode": "age_response_mid"
                },
                {
                    "condition": "userAge > 55",
                    "nextNode": "age_response_senior"
                }
            ]
        },
        {
            "id": "age_response_young",
            "type": "ai_message",
            "speaker": "ai",
            "content": "{{userAge}} — you're getting an early start on planning. That's smart. Time is one of your biggest advantages.",
            "nextNode": "ask_occupation",
            "delay": 1800
        },
        {
            "id": "age_response_mid",
            "type": "ai_message",
            "speaker": "ai",
            "content": "{{userAge}} — you're likely juggling a lot right now. Career, maybe family, thinking about the future. This is a great time to get organized.",
            "nextNode": "ask_occupation",
            "delay": 1800
        },
        {
            "id": "age_response_senior",
            "type": "ai_message",
            "speaker": "ai",
            "content": "{{userAge}} — you've got experience and perspective on your side. Whether you're wrapping up your career or already enjoying retirement, there's a lot we can do together.",
            "nextNode": "ask_occupation",
            "delay": 1800
        },
        {
            "id": "ask_occupation",
            "type": "choice",
            "speaker": "ai",
            "content": "What best describes your work situation right now?",
            "setsVariable": "employmentType",
            "options": [
                {
                    "id": "employed",
                    "label": "I work for an employer",
                    "value": "employed",
                    "nextNode": "occupation_employed_details"
                },
                {
                    "id": "self_employed",
                    "label": "I run my own business / freelance",
                    "value": "self_employed",
                    "nextNode": "occupation_self_employed_details"
                },
                {
                    "id": "retired",
                    "label": "I'm retired",
                    "value": "retired",
                    "nextNode": "occupation_retired_details"
                },
                {
                    "id": "transitioning",
                    "label": "I'm between jobs or transitioning",
                    "value": "transitioning",
                    "nextNode": "occupation_transitioning_details"
                },
                {
                    "id": "other",
                    "label": "Something else",
                    "value": "other",
                    "nextNode": "occupation_other_details"
                }
            ]
        },
        {
            "id": "occupation_employed_details",
            "type": "multi_input",
            "speaker": "ai",
            "content": "Got it — you're working for someone else. Tell me a bit more:",
            "inputs": [
                {
                    "id": "job_title",
                    "label": "What's your job title or role?",
                    "inputType": "text",
                    "placeholder": "e.g. Marketing Manager, Software Engineer",
                    "setsVariable": "occupation",
                    "required": true
                },
                {
                    "id": "employer_name",
                    "label": "Who do you work for? (optional)",
                    "inputType": "text",
                    "placeholder": "Company name",
                    "setsVariable": "employer",
                    "required": false
                },
                {
                    "id": "years_in_role",
                    "label": "How long have you been in this field?",
                    "inputType": "select",
                    "setsVariable": "yearsInField",
                    "options": [
                        {
                            "label": "Less than 2 years",
                            "value": 1
                        },
                        {
                            "label": "2-5 years",
                            "value": 3
                        },
                        {
                            "label": "5-10 years",
                            "value": 7
                        },
                        {
                            "label": "10-20 years",
                            "value": 15
                        },
                        {
                            "label": "20+ years",
                            "value": 25
                        }
                    ],
                    "required": true
                }
            ],
            "nextNode": "occupation_employed_response"
        },
        {
            "id": "occupation_employed_response",
            "type": "ai_message",
            "speaker": "ai",
            "content": "{{occupation}}{{employer ? ' at ' + employer : ''}} — nice. {{yearsInField > 10 ? 'You\\'ve built real expertise over the years.' : yearsInField > 5 ? 'You\\'re well established in your field.' : 'You\\'re building momentum.'}}",
            "nextNode": "ask_income_stability_employed",
            "delay": 1500
        },
        {
            "id": "ask_income_stability_employed",
            "type": "choice",
            "speaker": "ai",
            "content": "Is your income pretty stable, or does it vary a lot (like with bonuses or commissions)?",
            "setsVariable": "incomeStability",
            "options": [
                {
                    "id": "stable",
                    "label": "Stable — I know what to expect each paycheck",
                    "value": "stable",
                    "nextNode": "transition_to_upbringing"
                },
                {
                    "id": "variable",
                    "label": "Variable — bonuses, commissions, or overtime make a big difference",
                    "value": "variable",
                    "nextNode": "income_variable_response"
                },
                {
                    "id": "mixed",
                    "label": "A mix — base is steady but extras fluctuate",
                    "value": "mixed",
                    "nextNode": "transition_to_upbringing"
                }
            ]
        },
        {
            "id": "income_variable_response",
            "type": "ai_message",
            "speaker": "ai",
            "content": "Good to know. Variable income means we'll want to build extra flexibility into your plan — some good months, some leaner ones. Your advisor will help you smooth that out.",
            "nextNode": "transition_to_upbringing",
            "delay": 2000
        },
        {
            "id": "occupation_self_employed_details",
            "type": "multi_input",
            "speaker": "ai",
            "content": "Running your own thing — that takes guts. Tell me more:",
            "inputs": [
                {
                    "id": "business_type",
                    "label": "What kind of business or work do you do?",
                    "inputType": "text",
                    "placeholder": "e.g. Consulting, E-commerce, Freelance design",
                    "setsVariable": "businessType",
                    "required": true
                },
                {
                    "id": "years_in_business",
                    "label": "How long have you been doing this?",
                    "inputType": "select",
                    "setsVariable": "yearsInField",
                    "options": [
                        {
                            "label": "Less than 1 year",
                            "value": 0.5
                        },
                        {
                            "label": "1-3 years",
                            "value": 2
                        },
                        {
                            "label": "3-5 years",
                            "value": 4
                        },
                        {
                            "label": "5-10 years",
                            "value": 7
                        },
                        {
                            "label": "10+ years",
                            "value": 15
                        }
                    ],
                    "required": true
                }
            ],
            "nextNode": "occupation_self_employed_response"
        },
        {
            "id": "occupation_self_employed_response",
            "type": "ai_message",
            "speaker": "ai",
            "content": "{{businessType}} — {{yearsInField >= 5 ? 'you\\'ve been at this a while. That\\'s real staying power.' : yearsInField >= 2 ? 'you\\'re past the hardest part — getting started.' : 'the early days can be intense, but you\\'re building something.'}}",
            "nextNode": "self_employed_structure_question",
            "delay": 1800
        },
        {
            "id": "self_employed_structure_question",
            "type": "choice",
            "speaker": "ai",
            "content": "Quick question — is your business structured as an LLC, S-Corp, sole proprietorship, or something else?",
            "setsVariable": "businessStructure",
            "helperText": "This affects tax planning — your advisor will dig deeper.",
            "options": [
                {
                    "id": "sole_prop",
                    "label": "Sole proprietorship / just me",
                    "value": "sole_proprietorship",
                    "nextNode": "transition_to_upbringing"
                },
                {
                    "id": "llc",
                    "label": "LLC",
                    "value": "llc",
                    "nextNode": "transition_to_upbringing"
                },
                {
                    "id": "s_corp",
                    "label": "S-Corp",
                    "value": "s_corp",
                    "nextNode": "transition_to_upbringing"
                },
                {
                    "id": "c_corp",
                    "label": "C-Corp",
                    "value": "c_corp",
                    "nextNode": "transition_to_upbringing"
                },
                {
                    "id": "not_sure",
                    "label": "Not sure / haven't set one up",
                    "value": "not_sure",
                    "nextNode": "business_structure_not_sure_response"
                }
            ]
        },
        {
            "id": "business_structure_not_sure_response",
            "type": "ai_message",
            "speaker": "ai",
            "content": "No worries — that's actually something your advisor can help with. The right structure can save you real money on taxes.",
            "nextNode": "transition_to_upbringing",
            "delay": 1800
        },
        {
            "id": "occupation_retired_details",
            "type": "multi_input",
            "speaker": "ai",
            "content": "Congratulations on reaching retirement! A few quick questions:",
            "inputs": [
                {
                    "id": "retired_from",
                    "label": "What did you retire from?",
                    "inputType": "text",
                    "placeholder": "Your former career or role",
                    "setsVariable": "occupation",
                    "required": true
                },
                {
                    "id": "years_retired",
                    "label": "How long have you been retired?",
                    "inputType": "select",
                    "setsVariable": "yearsRetired",
                    "options": [
                        {
                            "label": "Less than 1 year",
                            "value": 0.5
                        },
                        {
                            "label": "1-3 years",
                            "value": 2
                        },
                        {
                            "label": "3-5 years",
                            "value": 4
                        },
                        {
                            "label": "5-10 years",
                            "value": 7
                        },
                        {
                            "label": "10+ years",
                            "value": 15
                        }
                    ],
                    "required": true
                }
            ],
            "nextNode": "occupation_retired_response"
        },
        {
            "id": "occupation_retired_response",
            "type": "ai_message",
            "speaker": "ai",
            "content": "{{occupation}} — {{yearsRetired < 2 ? 'you\\'re still adjusting to the new rhythm. That transition can be a lot.' : 'you\\'ve had time to settle into retirement. Hopefully it\\'s treating you well.'}}",
            "nextNode": "retired_income_question",
            "delay": 1800
        },
        {
            "id": "retired_income_question",
            "type": "choice",
            "speaker": "ai",
            "content": "Are you fully retired, or do you still do some work — consulting, part-time, passion projects?",
            "setsVariable": "retirementStatus",
            "options": [
                {
                    "id": "fully_retired",
                    "label": "Fully retired — no work income",
                    "value": "fully_retired",
                    "nextNode": "transition_to_upbringing"
                },
                {
                    "id": "semi_retired",
                    "label": "Semi-retired — I still earn some income",
                    "value": "semi_retired",
                    "nextNode": "semi_retired_response"
                },
                {
                    "id": "unretired",
                    "label": "I \"unretired\" — back to work in some capacity",
                    "value": "unretired",
                    "nextNode": "unretired_response"
                }
            ]
        },
        {
            "id": "semi_retired_response",
            "type": "ai_message",
            "speaker": "ai",
            "content": "That's a nice balance — keeping your hand in while having more freedom. Your advisor will factor that income into your plan.",
            "nextNode": "transition_to_upbringing",
            "delay": 1800
        },
        {
            "id": "unretired_response",
            "type": "ai_message",
            "speaker": "ai",
            "content": "That's more common than people think. Sometimes retirement isn't what we expected — or an opportunity came along. Either way, it changes the planning picture.",
            "nextNode": "transition_to_upbringing",
            "delay": 2000
        },
        {
            "id": "occupation_transitioning_details",
            "type": "choice",
            "speaker": "ai",
            "content": "Transitions can be stressful — but they can also be opportunities. Which best describes your situation?",
            "setsVariable": "transitionType",
            "options": [
                {
                    "id": "job_search",
                    "label": "I'm actively looking for work",
                    "value": "job_search",
                    "nextNode": "transition_job_search"
                },
                {
                    "id": "taking_break",
                    "label": "I'm taking a break — intentionally not working right now",
                    "value": "taking_break",
                    "nextNode": "transition_taking_break"
                },
                {
                    "id": "career_change",
                    "label": "I'm changing careers or going back to school",
                    "value": "career_change",
                    "nextNode": "transition_career_change"
                },
                {
                    "id": "caregiving",
                    "label": "I'm focused on family or caregiving right now",
                    "value": "caregiving",
                    "nextNode": "transition_caregiving"
                }
            ]
        },
        {
            "id": "transition_job_search",
            "type": "ai_message",
            "speaker": "ai",
            "content": "Job searching is a job in itself. This is exactly the kind of time when having a financial plan helps — knowing your runway and options. We'll make sure you're set up.",
            "nextNode": "transition_previous_work",
            "delay": 2000
        },
        {
            "id": "transition_taking_break",
            "type": "ai_message",
            "speaker": "ai",
            "content": "Sometimes you need to step back to figure out what's next. That takes courage — and good planning. We'll help you think through the financial side.",
            "nextNode": "transition_previous_work",
            "delay": 2000
        },
        {
            "id": "transition_career_change",
            "type": "ai_message",
            "speaker": "ai",
            "content": "Reinventing yourself is exciting — and a bit scary. Your advisor can help you map out the financial bridge to get there.",
            "nextNode": "transition_previous_work",
            "delay": 2000
        },
        {
            "id": "transition_caregiving",
            "type": "ai_message",
            "speaker": "ai",
            "content": "Caregiving is important work, even if it doesn't come with a paycheck. We'll make sure your plan accounts for this season of life.",
            "nextNode": "transition_previous_work",
            "delay": 2000
        },
        {
            "id": "transition_previous_work",
            "type": "input",
            "speaker": "ai",
            "content": "Before this transition, what kind of work were you doing?",
            "inputType": "text",
            "placeholder": "Your previous role or career",
            "setsVariable": "occupation",
            "validation": {
                "required": true
            },
            "nextNode": "transition_to_upbringing"
        },
        {
            "id": "occupation_other_details",
            "type": "input",
            "speaker": "ai",
            "content": "Tell me a bit about your situation — what does work look like for you right now?",
            "inputType": "textarea",
            "placeholder": "Describe your work situation",
            "setsVariable": "occupationOther",
            "validation": {
                "required": true
            },
            "nextNode": "occupation_other_response"
        },
        {
            "id": "occupation_other_response",
            "type": "ai_message",
            "speaker": "ai",
            "content": "Thanks for sharing that. Everyone's situation is different — that's why we don't just use cookie-cutter plans.",
            "nextNode": "transition_to_upbringing",
            "delay": 1500
        },
        {
            "id": "transition_to_upbringing",
            "type": "ai_message",
            "speaker": "ai",
            "content": "Now let's go a bit deeper. The way we grew up with money shapes how we think about it today — often more than we realize.",
            "nextNode": "ask_upbringing",
            "delay": 2000
        },
        {
            "id": "ask_upbringing",
            "type": "choice",
            "speaker": "ai",
            "content": "How would you describe your financial upbringing?",
            "setsVariable": "financialUpbringing",
            "options": [
                {
                    "id": "tight",
                    "label": "Money was tight — I learned to stretch every dollar",
                    "value": "tight",
                    "nextNode": "upbringing_tight_response"
                },
                {
                    "id": "comfortable",
                    "label": "Comfortable — we didn't worry, but weren't wealthy",
                    "value": "comfortable",
                    "nextNode": "upbringing_comfortable_response"
                },
                {
                    "id": "privileged",
                    "label": "Privileged — money wasn't something I thought about much",
                    "value": "privileged",
                    "nextNode": "upbringing_privileged_response"
                },
                {
                    "id": "complicated",
                    "label": "Complicated — it's a mix",
                    "value": "complicated",
                    "nextNode": "upbringing_complicated_response"
                }
            ]
        },
        {
            "id": "upbringing_tight_response",
            "type": "ai_message",
            "speaker": "ai",
            "content": "Growing up watching every dollar teaches you a lot — resourcefulness, awareness, sometimes anxiety around money too. That experience shapes your instincts in ways that can be both helpful and limiting. We'll work with that, not against it.",
            "nextNode": "upbringing_followup_tight",
            "delay": 2500
        },
        {
            "id": "upbringing_followup_tight",
            "type": "choice",
            "speaker": "ai",
            "content": "Would you say that background makes you more cautious with money, or has it pushed you to build wealth aggressively?",
            "setsVariable": "upbringingImpact",
            "options": [
                {
                    "id": "cautious",
                    "label": "More cautious — I hate the idea of going back to that",
                    "value": "cautious",
                    "nextNode": "upbringing_impact_cautious"
                },
                {
                    "id": "aggressive",
                    "label": "More aggressive — I'm determined to build something different",
                    "value": "aggressive",
                    "nextNode": "upbringing_impact_aggressive"
                },
                {
                    "id": "both",
                    "label": "A bit of both, honestly",
                    "value": "both",
                    "nextNode": "upbringing_impact_both"
                }
            ]
        },
        {
            "id": "upbringing_comfortable_response",
            "type": "ai_message",
            "speaker": "ai",
            "content": "A stable foundation is a real gift. It often gives people the confidence to take smart risks and think long-term. That's a good starting point for planning.",
            "nextNode": "transition_to_advisor_experience",
            "delay": 2000
        },
        {
            "id": "upbringing_privileged_response",
            "type": "ai_message",
            "speaker": "ai",
            "content": "When money wasn't a worry growing up, it can sometimes mean you didn't learn the nuts and bolts — or it can mean you had great financial role models. Either way, there's no judgment here. We'll build on what you know.",
            "nextNode": "upbringing_followup_privileged",
            "delay": 2500
        },
        {
            "id": "upbringing_followup_privileged",
            "type": "choice",
            "speaker": "ai",
            "content": "Did your family talk openly about money and investing, or was it more behind-the-scenes?",
            "setsVariable": "familyMoneyOpenness",
            "options": [
                {
                    "id": "open",
                    "label": "Pretty open — I learned a lot by watching",
                    "value": "open",
                    "nextNode": "transition_to_advisor_experience"
                },
                {
                    "id": "hidden",
                    "label": "Behind the scenes — I didn't learn much about how it worked",
                    "value": "hidden",
                    "nextNode": "upbringing_hidden_response"
                }
            ]
        },
        {
            "id": "upbringing_hidden_response",
            "type": "ai_message",
            "speaker": "ai",
            "content": "That's surprisingly common. Part of what we do is fill in those gaps — no shame in not knowing what you weren't taught.",
            "nextNode": "transition_to_advisor_experience",
            "delay": 1800
        },
        {
            "id": "upbringing_complicated_response",
            "type": "ai_message",
            "speaker": "ai",
            "content": "That's more common than you'd think. Maybe there were good years and hard years. Or different attitudes from different family members. Money is rarely simple.",
            "nextNode": "upbringing_followup_complicated",
            "delay": 2000
        },
        {
            "id": "upbringing_followup_complicated",
            "type": "input",
            "speaker": "ai",
            "content": "If you're comfortable sharing, what made it complicated? (Feel free to skip if you'd rather not.)",
            "inputType": "textarea",
            "placeholder": "Optional — share as much or as little as you'd like",
            "setsVariable": "upbringingDetails",
            "validation": {
                "required": false
            },
            "nextNode": "upbringing_complicated_acknowledgment"
        },
        {
            "id": "upbringing_complicated_acknowledgment",
            "type": "ai_message",
            "speaker": "ai",
            "content": "{{upbringingDetails ? 'Thanks for sharing that. It helps me understand where you\\'re coming from.' : 'No problem at all. Everyone has their own story.'}}",
            "nextNode": "transition_to_advisor_experience",
            "delay": 1500
        },
        {
            "id": "upbringing_impact_cautious",
            "type": "ai_message",
            "speaker": "ai",
            "content": "That makes a lot of sense. Security-first is a valid approach — we'll build a plan that helps you feel safe while still growing.",
            "nextNode": "transition_to_advisor_experience",
            "delay": 1800
        },
        {
            "id": "upbringing_impact_aggressive",
            "type": "ai_message",
            "speaker": "ai",
            "content": "That drive can be powerful. We'll channel it in smart ways — growth with guardrails.",
            "nextNode": "transition_to_advisor_experience",
            "delay": 1500
        },
        {
            "id": "upbringing_impact_both",
            "type": "ai_message",
            "speaker": "ai",
            "content": "That tension is normal. Part of planning is finding the balance between the voice that says \"save everything\" and the one that says \"build big.\"",
            "nextNode": "transition_to_advisor_experience",
            "delay": 2000
        },
        {
            "id": "transition_to_advisor_experience",
            "type": "ai_message",
            "speaker": "ai",
            "content": "One last question for this section — about your experience with financial advice.",
            "nextNode": "ask_advisor_experience",
            "delay": 1500
        },
        {
            "id": "ask_advisor_experience",
            "type": "choice",
            "speaker": "ai",
            "content": "Have you ever worked with a financial advisor before?",
            "setsVariable": "previousAdvisorExperience",
            "options": [
                {
                    "id": "yes",
                    "label": "Yes — I've had a financial advisor",
                    "value": "yes",
                    "nextNode": "advisor_yes_details"
                },
                {
                    "id": "no",
                    "label": "No — this is my first time",
                    "value": "no",
                    "nextNode": "advisor_no_response"
                },
                {
                    "id": "sort_of",
                    "label": "Sort of — I've used a robo-advisor or had a one-time consultation",
                    "value": "sort_of",
                    "nextNode": "advisor_sort_of_details"
                }
            ]
        },
        {
            "id": "advisor_yes_details",
            "type": "multi_input",
            "speaker": "ai",
            "content": "Good to know. Learning from past experiences helps us do better. Quick follow-up:",
            "inputs": [
                {
                    "id": "advisor_liked",
                    "label": "What worked well — what did you like?",
                    "inputType": "textarea",
                    "placeholder": "e.g. They explained things clearly, helped me stay disciplined...",
                    "setsVariable": "advisorLiked",
                    "required": false
                },
                {
                    "id": "advisor_disliked",
                    "label": "What didn't work — what would you change?",
                    "inputType": "textarea",
                    "placeholder": "e.g. Felt too salesy, didn't return calls, fees were confusing...",
                    "setsVariable": "advisorDisliked",
                    "required": false
                }
            ],
            "nextNode": "advisor_yes_response"
        },
        {
            "id": "advisor_yes_response",
            "type": "ai_message",
            "speaker": "ai",
            "content": "{{advisorLiked && advisorDisliked ? 'Thanks for the candid feedback. We\\'ll try to keep what worked and fix what didn\\'t.' : advisorLiked ? 'Great — we\\'ll aim to continue what worked well.' : advisorDisliked ? 'We\\'ll work hard to avoid those issues.' : 'That context is helpful for your advisor.'}}",
            "nextNode": "advisor_why_change",
            "delay": 1800
        },
        {
            "id": "advisor_why_change",
            "type": "choice",
            "speaker": "ai",
            "content": "What made you decide to look for a new advisor?",
            "setsVariable": "whyChangingAdvisor",
            "options": [
                {
                    "id": "moved",
                    "label": "I moved or life circumstances changed",
                    "value": "moved",
                    "nextNode": "chapter_summary"
                },
                {
                    "id": "not_right_fit",
                    "label": "The fit wasn't right",
                    "value": "not_right_fit",
                    "nextNode": "chapter_summary"
                },
                {
                    "id": "want_more",
                    "label": "I want more comprehensive advice",
                    "value": "want_more",
                    "nextNode": "chapter_summary"
                },
                {
                    "id": "fees",
                    "label": "The fees were too high or unclear",
                    "value": "fees",
                    "nextNode": "advisor_fees_response"
                },
                {
                    "id": "other",
                    "label": "Other reason",
                    "value": "other",
                    "nextNode": "chapter_summary"
                }
            ]
        },
        {
            "id": "advisor_fees_response",
            "type": "ai_message",
            "speaker": "ai",
            "content": "We get it. Our flat-fee model means you'll always know exactly what you're paying — no hidden costs or percentage-based surprises. Your advisor will explain exactly how it works.",
            "nextNode": "chapter_summary",
            "delay": 2000
        },
        {
            "id": "advisor_no_response",
            "type": "ai_message",
            "speaker": "ai",
            "content": "No problem — everyone starts somewhere. We'll make sure you understand how everything works. There's no such thing as a dumb question.",
            "nextNode": "advisor_no_followup",
            "delay": 1800
        },
        {
            "id": "advisor_no_followup",
            "type": "choice",
            "speaker": "ai",
            "content": "What made you decide to work with an advisor now?",
            "setsVariable": "whyAdvisorNow",
            "options": [
                {
                    "id": "life_event",
                    "label": "A life event — marriage, baby, inheritance, etc.",
                    "value": "life_event",
                    "nextNode": "chapter_summary"
                },
                {
                    "id": "complexity",
                    "label": "Things got too complex to manage on my own",
                    "value": "complexity",
                    "nextNode": "chapter_summary"
                },
                {
                    "id": "ready",
                    "label": "I finally feel ready / have enough to invest",
                    "value": "ready",
                    "nextNode": "chapter_summary"
                },
                {
                    "id": "worried",
                    "label": "I'm worried I'm not on track",
                    "value": "worried",
                    "nextNode": "advisor_worried_response"
                },
                {
                    "id": "curious",
                    "label": "Just curious to see what an advisor offers",
                    "value": "curious",
                    "nextNode": "chapter_summary"
                }
            ]
        },
        {
            "id": "advisor_worried_response",
            "type": "ai_message",
            "speaker": "ai",
            "content": "That concern is exactly why people come to us — and it's usually less scary than you think once we look at the numbers together. We'll figure out where you actually stand.",
            "nextNode": "chapter_summary",
            "delay": 2000
        },
        {
            "id": "advisor_sort_of_details",
            "type": "choice",
            "speaker": "ai",
            "content": "What kind of experience was it?",
            "setsVariable": "previousAdvisorType",
            "options": [
                {
                    "id": "robo",
                    "label": "Robo-advisor (Betterment, Wealthfront, etc.)",
                    "value": "robo",
                    "nextNode": "advisor_robo_response"
                },
                {
                    "id": "one_meeting",
                    "label": "One meeting or consultation — never followed through",
                    "value": "one_meeting",
                    "nextNode": "advisor_one_meeting_response"
                },
                {
                    "id": "bank_advisor",
                    "label": "Someone at my bank or brokerage",
                    "value": "bank_advisor",
                    "nextNode": "advisor_bank_response"
                },
                {
                    "id": "informal",
                    "label": "Informal advice from family or friends",
                    "value": "informal",
                    "nextNode": "advisor_informal_response"
                }
            ]
        },
        {
            "id": "advisor_robo_response",
            "type": "ai_message",
            "speaker": "ai",
            "content": "Robo-advisors are great for basic investing, but they can't answer your questions or adapt to your life. You're upgrading to the human touch — with technology to back it up.",
            "nextNode": "advisor_sort_of_followup",
            "delay": 2000
        },
        {
            "id": "advisor_one_meeting_response",
            "type": "ai_message",
            "speaker": "ai",
            "content": "That happens a lot. Sometimes the timing isn't right, or the connection wasn't there. This time, we'll make sure you feel comfortable moving forward.",
            "nextNode": "advisor_sort_of_followup",
            "delay": 1800
        },
        {
            "id": "advisor_bank_response",
            "type": "ai_message",
            "speaker": "ai",
            "content": "Bank advisors can be helpful, but they're often limited to their bank's products. We're independent — we recommend what's best for you, period.",
            "nextNode": "advisor_sort_of_followup",
            "delay": 1800
        },
        {
            "id": "advisor_informal_response",
            "type": "ai_message",
            "speaker": "ai",
            "content": "Family and friends mean well, but their advice is based on their situation, not yours. We'll give you personalized guidance grounded in your actual numbers.",
            "nextNode": "advisor_sort_of_followup",
            "delay": 1800
        },
        {
            "id": "advisor_sort_of_followup",
            "type": "choice",
            "speaker": "ai",
            "content": "What's driving you to seek more comprehensive advice now?",
            "setsVariable": "whyMoreAdviceNow",
            "options": [
                {
                    "id": "outgrew_robo",
                    "label": "I've outgrown the automated approach",
                    "value": "outgrew_robo",
                    "nextNode": "chapter_summary"
                },
                {
                    "id": "need_planning",
                    "label": "I need real planning, not just investing",
                    "value": "need_planning",
                    "nextNode": "chapter_summary"
                },
                {
                    "id": "questions",
                    "label": "I have questions a robot can't answer",
                    "value": "questions",
                    "nextNode": "chapter_summary"
                },
                {
                    "id": "accountability",
                    "label": "I want someone to hold me accountable",
                    "value": "accountability",
                    "nextNode": "chapter_summary"
                }
            ]
        },
        {
            "id": "chapter_summary",
            "type": "ai_message",
            "speaker": "ai",
            "content": "Alright, {{userName}} — here's what I've learned so far:\n\nYou're {{userAge}}, {{employmentType === 'employed' ? 'working as a ' + occupation + (employer ? ' at ' + employer : '') : employmentType === 'self_employed' ? 'running your own ' + businessType + ' business' : employmentType === 'retired' ? 'retired from ' + occupation : employmentType === 'transitioning' ? 'in transition from ' + occupation : 'in a unique work situation'}}.\n\nYou grew up in a household where {{financialUpbringing === 'tight' ? 'money was tight — which shaped how you think about it today' : financialUpbringing === 'comfortable' ? 'money wasn\\'t a constant worry' : financialUpbringing === 'privileged' ? 'money wasn\\'t something you had to think about much' : 'money was... complicated'}}.\n\n{{previousAdvisorExperience === 'yes' ? 'You\\'ve worked with advisors before and know what you\\'re looking for.' : previousAdvisorExperience === 'sort_of' ? 'You\\'ve dipped your toe in but are ready for more comprehensive guidance.' : 'This is your first time working with an advisor — we\\'ll make sure you feel informed every step of the way.'}}",
            "nextNode": "chapter_confirmation",
            "delay": 3000
        },
        {
            "id": "chapter_confirmation",
            "type": "choice",
            "speaker": "ai",
            "content": "Does that sound right?",
            "options": [
                {
                    "id": "correct",
                    "label": "Yes, that's me",
                    "value": "correct",
                    "nextNode": "chapter_complete"
                },
                {
                    "id": "edit",
                    "label": "I'd like to change something",
                    "value": "edit",
                    "nextNode": "chapter_edit"
                }
            ]
        },
        {
            "id": "chapter_edit",
            "type": "choice",
            "speaker": "ai",
            "content": "No problem — what would you like to update?",
            "options": [
                {
                    "id": "edit_age",
                    "label": "My age",
                    "value": "edit_age",
                    "nextNode": "ask_age"
                },
                {
                    "id": "edit_work",
                    "label": "My work situation",
                    "value": "edit_work",
                    "nextNode": "ask_occupation"
                },
                {
                    "id": "edit_upbringing",
                    "label": "My financial upbringing",
                    "value": "edit_upbringing",
                    "nextNode": "ask_upbringing"
                },
                {
                    "id": "edit_advisor",
                    "label": "My advisor experience",
                    "value": "edit_advisor",
                    "nextNode": "ask_advisor_experience"
                }
            ]
        },
        {
            "id": "chapter_complete",
            "type": "ai_message",
            "speaker": "ai",
            "content": "Perfect. You've just completed Chapter 1 — we know where you've been.\n\nNext up: let's look at where you are today — your income, what you've saved, and what you owe.",
            "nextNode": null,
            "isChapterEnd": true,
            "nextChapter": "chapter_2"
        }
    ],
    "metadata": {
        "version": "1.0.0",
        "created": "2024-12-03",
        "author": "Onboarding Team",
        "totalNodes": 58,
        "estimatedBranches": 12,
        "requiredVariables": [
            "userName",
            "userAge",
            "employmentType",
            "financialUpbringing",
            "previousAdvisorExperience"
        ]
    }
} as const;
