import React from 'react';

const SubscriptionCard = ({ plan, onSubscribe }) => (
  <div className="border rounded-lg p-4 m-2 w-64">
    <h3 className="text-xl font-bold">{plan.name}</h3>
    <p>{plan.features.join(', ')}</p>
    <p className="mt-2">
      {plan.prices.map(price => (
        <span key={price.currency}>
          {price.amount} {price.currency}
          <br />
        </span>
      ))}
    </p>
    <button
      className="mt-4 bg-blue-500 text-white px-4 py-2 rounded"
      onClick={() => onSubscribe(plan._id)}
      disabled={plan.name === 'Free'}
    >
      {plan.name === 'Free' ? 'Default Plan' : 'Subscribe'}
    </button>
  </div>
);

export default SubscriptionCard;
