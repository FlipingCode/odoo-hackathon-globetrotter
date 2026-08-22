/**
 * Calculates complete trip budgeting analytics, category distributions,
 * day-by-day cost timeline, and budget health alerts.
 */
function calculateTripBudget(trip, stops = [], activities = [], customExpenses = []) {
  const startDate = new Date(trip.start_date);
  const endDate = new Date(trip.end_date);
  
  // Calculate total trip duration in days
  const timeDiff = Math.max(0, endDate.getTime() - startDate.getTime());
  const totalDays = Math.max(1, Math.round(timeDiff / (1000 * 3600 * 24)) + 1);

  let totalStayCost = 0;
  let totalTransportCost = 0;
  let totalActivityCost = 0;
  let totalMealCost = 0;
  let totalMiscCost = 0;

  // 1. Calculate Stay & Transport from Stops
  const stopMapByDate = {};

  stops.forEach((stop) => {
    const arr = new Date(stop.arrival_date);
    const dep = new Date(stop.departure_date);
    const stayNights = Math.max(0, Math.round((dep.getTime() - arr.getTime()) / (1000 * 3600 * 24)));
    
    const stopStayTotal = (stop.stay_cost_per_night || 0) * (stayNights || 1);
    const stopTransport = stop.transport_cost_to_stop || 0;

    totalStayCost += stopStayTotal;
    totalTransportCost += stopTransport;

    // Populate day date map
    const curr = new Date(arr);
    while (curr <= dep) {
      const dateStr = curr.toISOString().split('T')[0];
      stopMapByDate[dateStr] = {
        stop_id: stop.id,
        city_name: stop.city_name,
        country: stop.country,
        stay_cost_per_night: stop.stay_cost_per_night || 0,
        is_arrival_day: dateStr === stop.arrival_date,
        transport_cost: dateStr === stop.arrival_date ? stopTransport : 0
      };
      curr.setDate(curr.getDate() + 1);
    }
  });

  // 2. Calculate Activities Cost
  const activitiesByDay = {};
  activities.forEach((act) => {
    const cost = Number(act.estimated_cost) || 0;
    totalActivityCost += cost;

    const dayNum = act.day_number || 1;
    if (!activitiesByDay[dayNum]) {
      activitiesByDay[dayNum] = [];
    }
    activitiesByDay[dayNum].push({
      id: act.id,
      name: act.name,
      category: act.category,
      cost: cost,
      scheduled_time: act.scheduled_time
    });
  });

  // 3. Custom Expenses
  customExpenses.forEach((exp) => {
    const amt = Number(exp.amount) || 0;
    const cat = (exp.category || '').toLowerCase();

    if (cat === 'stay' || cat === 'accommodation') totalStayCost += amt;
    else if (cat === 'transport' || cat === 'travel') totalTransportCost += amt;
    else if (cat === 'activities' || cat === 'sightseeing') totalActivityCost += amt;
    else if (cat === 'meals' || cat === 'food') totalMealCost += amt;
    else totalMiscCost += amt;
  });

  // 4. Default estimated meals ($35/day default if none recorded)
  if (totalMealCost === 0) {
    totalMealCost = totalDays * 35;
  }

  // 5. Aggregate totals
  const totalEstimatedCost = totalStayCost + totalTransportCost + totalActivityCost + totalMealCost + totalMiscCost;
  const targetBudget = Number(trip.target_budget) || 0;
  const remainingBudget = targetBudget > 0 ? (targetBudget - totalEstimatedCost) : 0;
  const averageCostPerDay = totalDays > 0 ? Number((totalEstimatedCost / totalDays).toFixed(2)) : 0;

  // Category percentage breakdown
  const categoryBreakdown = [
    {
      category: 'Stay & Accommodation',
      key: 'stay',
      amount: Number(totalStayCost.toFixed(2)),
      percentage: totalEstimatedCost > 0 ? Number(((totalStayCost / totalEstimatedCost) * 100).toFixed(1)) : 0
    },
    {
      category: 'Transport & Flights',
      key: 'transport',
      amount: Number(totalTransportCost.toFixed(2)),
      percentage: totalEstimatedCost > 0 ? Number(((totalTransportCost / totalEstimatedCost) * 100).toFixed(1)) : 0
    },
    {
      category: 'Activities & Tours',
      key: 'activities',
      amount: Number(totalActivityCost.toFixed(2)),
      percentage: totalEstimatedCost > 0 ? Number(((totalActivityCost / totalEstimatedCost) * 100).toFixed(1)) : 0
    },
    {
      category: 'Food & Meals',
      key: 'meals',
      amount: Number(totalMealCost.toFixed(2)),
      percentage: totalEstimatedCost > 0 ? Number(((totalMealCost / totalEstimatedCost) * 100).toFixed(1)) : 0
    },
    {
      category: 'Miscellaneous & Other',
      key: 'miscellaneous',
      amount: Number(totalMiscCost.toFixed(2)),
      percentage: totalEstimatedCost > 0 ? Number(((totalMiscCost / totalEstimatedCost) * 100).toFixed(1)) : 0
    }
  ];

  // 6. Day-by-day Cost Timeline
  const dailyTimeline = [];
  let highestDayCost = -1;
  let highestExpenseDayNumber = 1;

  for (let d = 0; d < totalDays; d++) {
    const dayDate = new Date(startDate);
    dayDate.setDate(startDate.getDate() + d);
    const dateStr = dayDate.toISOString().split('T')[0];
    const dayNum = d + 1;

    const stopInfo = stopMapByDate[dateStr] || {
      city_name: stops[0]?.city_name || 'Travel Day',
      stay_cost_per_night: stops[0]?.stay_cost_per_night || 0,
      transport_cost: d === 0 ? (stops[0]?.transport_cost_to_stop || 0) : 0
    };

    const dayActivities = activitiesByDay[dayNum] || [];
    const dayActivityTotal = dayActivities.reduce((sum, item) => sum + item.cost, 0);
    const dayStay = Number(stopInfo.stay_cost_per_night) || 0;
    const dayTransport = Number(stopInfo.transport_cost) || 0;
    const dayMeals = Number((totalMealCost / totalDays).toFixed(2));

    const dayTotal = dayStay + dayTransport + dayActivityTotal + dayMeals;

    if (dayTotal > highestDayCost) {
      highestDayCost = dayTotal;
      highestExpenseDayNumber = dayNum;
    }

    dailyTimeline.push({
      day_number: dayNum,
      date: dateStr,
      city: stopInfo.city_name,
      stay_cost: dayStay,
      transport_cost: dayTransport,
      activities_cost: dayActivityTotal,
      meals_cost: dayMeals,
      total_cost: Number(dayTotal.toFixed(2)),
      activities: dayActivities
    });
  }

  // 7. Budget Status & Over-budget detection
  let budgetStatus = 'not_set';
  const alerts = [];

  if (targetBudget > 0) {
    if (totalEstimatedCost > targetBudget) {
      budgetStatus = 'over_budget';
      alerts.push({
        type: 'danger',
        message: `Trip is over budget by ${trip.currency || '$'}${Math.abs(remainingBudget).toFixed(2)} (${((totalEstimatedCost / targetBudget) * 100 - 100).toFixed(1)}% excess).`
      });
    } else if (totalEstimatedCost >= targetBudget * 0.9) {
      budgetStatus = 'warning_near_limit';
      alerts.push({
        type: 'warning',
        message: `Trip has reached 90%+ of the target budget (${trip.currency || '$'}${remainingBudget.toFixed(2)} remaining).`
      });
    } else {
      budgetStatus = 'on_track';
      alerts.push({
        type: 'success',
        message: `Within budget with ${trip.currency || '$'}${remainingBudget.toFixed(2)} remaining.`
      });
    }
  }

  const overbudgetDays = dailyTimeline.filter(
    (day) => day.total_cost > averageCostPerDay * 1.6 && averageCostPerDay > 0
  );

  if (overbudgetDays.length > 0) {
    alerts.push({
      type: 'info',
      message: `${overbudgetDays.length} day(s) have spending significantly higher than your daily average.`
    });
  }

  return {
    currency: trip.currency || 'USD',
    target_budget: targetBudget,
    total_estimated_cost: Number(totalEstimatedCost.toFixed(2)),
    remaining_budget: Number(remainingBudget.toFixed(2)),
    average_cost_per_day: averageCostPerDay,
    total_days: totalDays,
    budget_status: budgetStatus,
    category_breakdown: categoryBreakdown,
    daily_timeline: dailyTimeline,
    highest_expense_day: {
      day_number: highestExpenseDayNumber,
      amount: Number(highestDayCost.toFixed(2))
    },
    alerts
  };
}

module.exports = { calculateTripBudget };