import React from 'react';
import { Control } from 'react-hook-form';
import { FormControl, FormField, FormItem, FormLabel } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { type Assessment } from '@/types';

const TRANSFER_TYPES = [
  {
    id: 'bed_mobility',
    label: 'Bed Mobility',
    description: 'Rolling, repositioning, and moving in bed',
    activities: [
      { id: 'supine_to_sit', name: 'Supine to Sitting' },
      { id: 'rolling', name: 'Rolling' },
      { id: 'repositioning', name: 'Repositioning' }
    ]
  },
  {
    id: 'bed_transfers',
    label: 'Bed Transfers',
    description: 'Moving in and out of bed',
    activities: [
      { id: 'sit_to_stand', name: 'Sit to Stand' },
      { id: 'stand_to_sit', name: 'Stand to Sit' }
    ]
  },
  {
    id: 'toilet_transfers',
    label: 'Toilet Transfers',
    description: 'Transfers to and from toilet',
    activities: [
      { id: 'approach', name: 'Toilet Approach' },
      { id: 'lowering', name: 'Lowering to Toilet' },
      { id: 'rising', name: 'Rising from Toilet' }
    ]
  },
  {
    id: 'shower_transfers',
    label: 'Shower/Bath Transfers',
    description: 'Transfers in and out of shower/bath',
    activities: [
      { id: 'shower_entry', name: 'Shower Entry' },
      { id: 'shower_exit', name: 'Shower Exit' },
      { id: 'bath_entry', name: 'Bath Entry/Exit' }
    ]
  },
  {
    id: 'car_transfers',
    label: 'Car Transfers',
    description: 'Getting in and out of vehicles',
    activities: [
      { id: 'car_entry', name: 'Car Entry' },
      { id: 'car_exit', name: 'Car Exit' }
    ]
  }
];

const INDEPENDENCE_LEVELS = [
  { value: "independent", label: "Independent", description: "No assistance required" },
  { value: "supervision", label: "Supervision", description: "Requires supervision for safety" },
  { value: "minimal_assist", label: "Minimal Assistance", description: "Requires minimal physical assistance" },
  { value: "moderate_assist", label: "Moderate Assistance", description: "Requires moderate physical assistance" },
  { value: "maximal_assist", label: "Maximal Assistance", description: "Requires significant physical assistance" },
  { value: "dependent", label: "Dependent", description: "Requires full assistance" }
];

export function TransfersAssessment({ control }: { control: Control<Assessment> }) {
  return (
    <div className="space-y-8">
      {TRANSFER_TYPES.map((transferType) => (
        <div 
          key={transferType.id}
          className="bg-white rounded-lg border p-4 space-y-6"
        >
          <div>
            <h3 className="text-lg font-medium">{transferType.label}</h3>
            <p className="text-sm text-muted-foreground">{transferType.description}</p>
          </div>

          <div className="space-y-6">
            {transferType.activities.map((activity) => (
              <div 
                key={activity.id}
                className="border rounded-lg p-4 space-y-4"
              >
                <h4 className="font-medium">{activity.name}</h4>
                
                <FormField
                  control={control}
                  name={`functionalAssessment.transfers.${transferType.id}.${activity.id}.level`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Independence Level</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select independence level" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {INDEPENDENCE_LEVELS.map((level) => (
                            <SelectItem
                              key={level.value}
                              value={level.value}
                              className="flex flex-col items-start py-2"
                            >
                              <div className="font-medium">{level.label}</div>
                              <div className="text-xs text-muted-foreground">{level.description}</div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormItem>
                  )}
                />

                <FormField
                  control={control}
                  name={`functionalAssessment.transfers.${transferType.id}.${activity.id}.notes`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Observations & Notes</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Enter any observations, limitations, or assistance requirements..."
                          className="min-h-[100px]"
                          {...field}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}