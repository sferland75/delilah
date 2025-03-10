import React from 'react';
import { Control, useFormContext } from 'react-hook-form';
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { CORE_JOINTS, ROM_PERCENTAGES } from './rom-values';
import { Label } from '@/components/ui/label';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Checkbox } from "@/components/ui/checkbox";
import { ChevronDown, ChevronRight, Info } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface ROMAssessmentProps {
  control: Control<any>;
  prefix: string;
}

export function ROMAssessment({ control, prefix }: ROMAssessmentProps) {
  const { setValue } = useFormContext();
  const [openSections, setOpenSections] = React.useState<string[]>([]);
  const [modifiedSections, setModifiedSections] = React.useState<string[]>([]);

  const toggleSection = (joint: string) => {
    setOpenSections(prev => 
      prev.includes(joint) 
        ? prev.filter(j => j !== joint)
        : [...prev, joint]
    );
  };

  // Set initial values to normal (100%)
  React.useEffect(() => {
    CORE_JOINTS.forEach((joint) => {
      joint.movements.forEach((movement) => {
        setValue(`${prefix}.${joint.joint}.${movement.name}.left`, "100", { shouldDirty: false });
        setValue(`${prefix}.${joint.joint}.${movement.name}.right`, "100", { shouldDirty: false });
      });
    });
  }, [setValue, prefix]);

  return (
    <div className="space-y-6">
      {CORE_JOINTS.map((joint) => (
        <Collapsible 
          key={joint.joint} 
          open={openSections.includes(joint.joint)}
          className="bg-white rounded-lg border border-slate-200 shadow-sm"
        >
          <div className="flex items-center justify-between w-full p-4 hover:bg-slate-50">
            <CollapsibleTrigger 
              className="flex items-center gap-3"
              onClick={() => toggleSection(joint.joint)}
            >
              {openSections.includes(joint.joint) ? 
                <ChevronDown className="h-5 w-5" /> : 
                <ChevronRight className="h-5 w-5" />
              }
              <h3 className="text-lg font-medium text-slate-800">{joint.joint}</h3>
              {modifiedSections.includes(joint.joint) && (
                <Badge variant="secondary">Modified</Badge>
              )}
            </CollapsibleTrigger>
            
            <FormField
              control={control}
              name={`${prefix}.${joint.joint}.isAffected`}
              render={({ field }) => (
                <div className="flex items-center gap-2">
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={(checked) => {
                      field.onChange(checked);
                      if (checked) {
                        setOpenSections(prev => [...prev, joint.joint]);
                        setModifiedSections(prev => [...prev, joint.joint]);
                      }
                    }}
                  />
                  <span className="text-sm text-slate-600">Joint Affected</span>
                </div>
              )}
            />
          </div>

          <CollapsibleContent>
            <div className="p-4 pt-0 space-y-6">
              {joint.movements.map((movement) => (
                <div key={movement.name} className="space-y-4">
                  <div className="flex items-baseline justify-between">
                    <h4 className="font-medium text-slate-700">{movement.name}</h4>
                    <span className="text-sm text-slate-600">Normal Range: {movement.normalROM}</span>
                  </div>

                  <div className="grid grid-cols-2 gap-6">
                    {/* Left Side */}
                    <FormField
                      control={control}
                      name={`${prefix}.${joint.joint}.${movement.name}.left`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-slate-700">Left Side ROM</FormLabel>
                          <FormControl>
                            <RadioGroup
                              onValueChange={(value) => {
                                field.onChange(value);
                                if (value !== "100") {
                                  setModifiedSections(prev => 
                                    prev.includes(joint.joint) ? prev : [...prev, joint.joint]
                                  );
                                }
                              }}
                              defaultValue="100"
                              value={field.value}
                              className="flex flex-col space-y-1"
                            >
                              {ROM_PERCENTAGES.map((percent) => (
                                <div key={percent.value} className="flex items-center space-x-2">
                                  <RadioGroupItem value={percent.value.toString()} id={`${movement.name}-left-${percent.value}`} />
                                  <Label htmlFor={`${movement.name}-left-${percent.value}`}>{percent.label}</Label>
                                </div>
                              ))}
                            </RadioGroup>
                          </FormControl>
                        </FormItem>
                      )}
                    />

                    {/* Right Side */}
                    <FormField
                      control={control}
                      name={`${prefix}.${joint.joint}.${movement.name}.right`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-slate-700">Right Side ROM</FormLabel>
                          <FormControl>
                            <RadioGroup
                              onValueChange={(value) => {
                                field.onChange(value);
                                if (value !== "100") {
                                  setModifiedSections(prev => 
                                    prev.includes(joint.joint) ? prev : [...prev, joint.joint]
                                  );
                                }
                              }}
                              defaultValue="100"
                              value={field.value}
                              className="flex flex-col space-y-1"
                            >
                              {ROM_PERCENTAGES.map((percent) => (
                                <div key={percent.value} className="flex items-center space-x-2">
                                  <RadioGroupItem value={percent.value.toString()} id={`${movement.name}-right-${percent.value}`} />
                                  <Label htmlFor={`${movement.name}-right-${percent.value}`}>{percent.label}</Label>
                                </div>
                              ))}
                            </RadioGroup>
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </div>

                  {/* Observations */}
                  <FormField
                    control={control}
                    name={`${prefix}.${joint.joint}.${movement.name}.observations`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-slate-700">Observations</FormLabel>
                        <FormControl>
                          <Textarea
                            {...field}
                            placeholder="Note any pain, quality of movement, compensations, etc..."
                            className="min-h-[80px]"
                            onChange={(e) => {
                              field.onChange(e);
                              if (e.target.value) {
                                setModifiedSections(prev => 
                                  prev.includes(joint.joint) ? prev : [...prev, joint.joint]
                                );
                              }
                            }}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>
              ))}
            </div>
          </CollapsibleContent>
        </Collapsible>
      ))}

      {/* General Notes - Only shown if any sections are modified */}
      {modifiedSections.length > 0 && (
        <div className="bg-white rounded-lg border border-slate-200 shadow-sm p-4">
          <FormField
            control={control}
            name={`${prefix}.generalNotes`}
            render={({ field }) => (
              <FormItem>
                <FormLabel>General Assessment Notes</FormLabel>
                <FormControl>
                  <Textarea
                    {...field}
                    placeholder="Enter overall observations, patterns, and functional implications..."
                    className="min-h-[100px]"
                  />
                </FormControl>
              </FormItem>
            )}
          />
        </div>
      )}
    </div>
  );
}