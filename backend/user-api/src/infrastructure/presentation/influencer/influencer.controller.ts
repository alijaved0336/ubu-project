import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Get,
  HttpCode,
  Inject,
  Param,
  Post,
  Req,
  Request,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import UsecaseProxy, {
  AUTH_USECASE_PROXY,
  INFLUENCER_USECASE_PROXY,
} from 'infrastructure-usecases-bridge/usecase-proxy';
import { InfluencerUsecase } from '@use-cases/influencer.usecase';
import { JwtAuthGuard } from '@infrastructure/guards/jwt-auth.guard';
import { ApiTags, ApiOperation, ApiParam, ApiResponse, ApiBearerAuth, ApiBody } from '@nestjs/swagger';
import { FetchFilteredInfluencersDto, InfluncerIdDTO } from './influencer.dto'; // Import the DTO

@UseInterceptors(ClassSerializerInterceptor)
@ApiTags('influencer')
@ApiBearerAuth()
@Controller('influencer')
export class InfluencerController {
  constructor(
    @Inject(INFLUENCER_USECASE_PROXY)
    private readonly influencerUsecaseProxy: UsecaseProxy<InfluencerUsecase>,
  ) { }

  @UseGuards(JwtAuthGuard)
  @Get('/:influncer_id')
  @ApiOperation({ summary: 'Get influencer by ID' })
  @ApiParam({ name: 'influncer_id', description: 'The ID of the influencer' })
  @ApiResponse({ status: 200, description: 'Influencer retrieved successfully.' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async getInfluncer(
    @Param() params: InfluncerIdDTO,
    @Req() request,
  ) {
    return this.influencerUsecaseProxy.getInstance().getInfluncer(params.influncer_id, request.user?.id);
  }

  @ApiTags('Influencers')
  @Post('/fetch-filtered-influencers')
  @ApiOperation({
    summary: 'Fetch filtered influencers by various criteria',
    description: `
      Filter influencers based on multiple criteria including measurements, budget, styles, hobbies, sports, location, and body shape:
      
      **Measurement Filters:**
      - If only minHeight or maxHeight is provided: Exact height match
      - If both are provided: Inclusive height range
      - If only minWeight or maxWeight is provided: Exact weight match
      - If both are provided: Inclusive weight range
      - Height values should be in millimeters (as strings)
      - Weight values should be in kilograms (as strings)
  
      **Answer-based Filters (Budget, Styles, Hobbies, Sports, Location, Body Shape):**
      - selectedOptions: Array of strings to match against user_answer.selected_options
      - Uses AND operation: Returns influencers whose selected_options array contains of the provided strings
      - Case-sensitive matching
  
      You can filter by any combination of these filters.
    `,
  })
  @ApiBody({
    type: FetchFilteredInfluencersDto,
    description: 'Filter criteria for influencers',
    examples: {
      exactHeightMin: {
        summary: 'Exact height using minHeight',
        description: 'Find influencers with exact height of 1549mm',
        value: {
          measurementFilter: {
            minHeight: '1549'
          }
        }
      },
      exactHeightMax: {
        summary: 'Exact height using maxHeight',
        description: 'Find influencers with exact height of 1600mm',
        value: {
          measurementFilter: {
            maxHeight: '1600'
          }
        }
      },
      heightRange: {
        summary: 'Height range',
        description: 'Find influencers with height between 1500mm and 1600mm',
        value: {
          measurementFilter: {
            minHeight: '1500',
            maxHeight: '1600'
          }
        }
      },
      exactWeightMin: {
        summary: 'Exact weight using minWeight',
        description: 'Find influencers with exact weight of 55000 grams',
        value: {
          measurementFilter: {
            minWeight: '55000'
          }
        }
      },
      exactWeightMax: {
        summary: 'Exact weight using maxWeight',
        description: 'Find influencers with exact weight of 60000 grams',
        value: {
          measurementFilter: {
            maxWeight: '60000'
          }
        }
      },
      weightRange: {
        summary: 'Weight range',
        description: 'Find influencers with weight between 45000 grams and 60000 grams',
        value: {
          measurementFilter: {
            minWeight: '45000',
            maxWeight: '60000'
          }
        }
      },
      heightAndWeightRange: {
        summary: 'Height and weight range',
        description: 'Find influencers with height 1500–1600mm and weight 45000–60000 grams',
        value: {
          measurementFilter: {
            minHeight: '1500',
            maxHeight: '1600',
            minWeight: '45000',
            maxWeight: '60000'
          }
        }
      },
      budgetFilter: {
        summary: 'Budget filter',
        description: 'Find influencers with specific budget preferences',
        value: {
          budgetAnswersFilter: {
            selectedOptions: ['Saver', 'Practical Picker', 'Mix & Match']
          }
        }
      },
      stylesFilter: {
        summary: 'Styles filter',
        description: 'Find influencers with specific style preferences',
        value: {
          stylesAnswersFilter: {
            selectedOptions: ['Vintage Vibes', 'Bold', 'Urban Chic', 'Beachy Vibes']
          }
        }
      },
      hobbiesFilter: {
        summary: 'Hobbies and interests filter',
        description: 'Find influencers with specific hobbies and interests',
        value: {
          hobbiesAnswersFilter: {
            selectedOptions: ['Fashion', 'Beauty', 'Fitness', 'Food and Cooking']
          }
        }
      },
      sportsFilter: {
        summary: 'Sports filter',
        description: 'Find influencers who play specific sports',
        value: {
          sportsAnswersFilter: {
            selectedOptions: ['Basketball', 'Football (American)', 'Soccer', 'Martial Arts']
          }
        }
      },
      locationFilter: {
        summary: 'Location filter',
        description: 'Find influencers from specific geographic regions',
        value: {
          locationAnswersFilter: {
            selectedOptions: ['Northeast', 'Midwest', 'South', 'Central Mexico']
          }
        }
      },
      bodyShapeFilter: {
        summary: 'Body shape filter',
        description: 'Find influencers with specific body shapes',
        value: {
          bodyShapeAnswersFilter: {
            selectedOptions: ['Pear', 'Apple', 'Hourglass', 'Rectangle-shaped']
          }
        }
      },
      combinedFilters: {
        summary: 'Combined filters - All filters together',
        description: 'Find influencers using all available filter criteria combined',
        value: {
          measurementFilter: {
            minHeight: '1500',
            maxHeight: '1700',
            minWeight: '45000',
            maxWeight: '65000'
          },
          budgetAnswersFilter: {
            selectedOptions: ['Saver', 'Practical Picker', 'Mix & Match']
          },
          stylesAnswersFilter: {
            selectedOptions: ['Vintage Vibes', 'Bold', 'Urban Chic', 'Beachy Vibes']
          },
          hobbiesAnswersFilter: {
            selectedOptions: ['Fashion', 'Beauty', 'Fitness', 'Food and Cooking']
          },
          sportsAnswersFilter: {
            selectedOptions: ['Basketball', 'Football (American)', 'Soccer', 'Martial Arts']
          },
          locationAnswersFilter: {
            selectedOptions: ['Northeast', 'Midwest', 'South', 'Central Mexico']
          },
          bodyShapeAnswersFilter: {
            selectedOptions: ['Pear', 'Apple', 'Hourglass', 'Rectangle-shaped']
          }
        }
      },
      measurementOnly: {
        summary: 'Measurement filters only',
        description: 'Find influencers based only on height and weight measurements',
        value: {
          measurementFilter: {
            minHeight: '1550',
            maxHeight: '1650',
            minWeight: '50000',
            maxWeight: '70000'
          }
        }
      },
      answersOnly: {
        summary: 'Answer-based filters only',
        description: 'Find influencers based only on their answer preferences',
        value: {
          budgetAnswersFilter: {
            selectedOptions: ['Saver', 'Practical Picker', 'Mix & Match']
          },
          stylesAnswersFilter: {
            selectedOptions: ['Vintage Vibes', 'Bold', 'Urban Chic', 'Beachy Vibes']
          },
          hobbiesAnswersFilter: {
            selectedOptions: ['Fashion', 'Beauty', 'Fitness', 'Food and Cooking']
          },
          sportsAnswersFilter: {
            selectedOptions: ['Basketball', 'Football (American)', 'Soccer', 'Martial Arts']
          },
          locationAnswersFilter: {
            selectedOptions: ['Northeast', 'Midwest', 'South', 'Central Mexico']
          },
          bodyShapeAnswersFilter: {
            selectedOptions: ['Pear', 'Apple', 'Hourglass', 'Rectangle-shaped']
          }
        }
      },
      noFilter: {
        summary: 'No filter',
        description: 'Fetch all influencers without any filtering',
        value: {}
      }
    }
  })
  @ApiResponse({
    status: 200,
    description: 'Successfully retrieved filtered influencers',
    schema: {
      type: 'object',
      properties: {
        data: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              id: { type: 'number', example: 1 },
              avatar: { type: 'string', example: 'avatar_url.jpg' },
              user: {
                type: 'object',
                properties: {
                  id: { type: 'number', example: 101 },
                  first_name: { type: 'string', example: 'John' },
                  last_name: { type: 'string', example: 'Doe' },
                  user_answer: {
                    type: 'array',
                    items: {
                      type: 'object',
                      properties: {
                        selected_options: { 
                          type: 'array', 
                          items: { type: 'string' },
                          example: ['Casual', 'Sporty'] 
                        }
                      }
                    }
                  }
                }
              },
              measurement: {
                type: 'object',
                properties: {
                  input: {
                    type: 'object',
                    properties: {
                      photoScan: {
                        type: 'object',
                        properties: {
                          height: { type: 'number', example: 1650 },
                          weight: { type: 'number', example: 55 },
                          gender: { type: 'string', example: 'female' }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        },
        total: {
          type: 'number',
          example: 124
        }
      }
    }
  })
  @ApiResponse({
    status: 400,
    description: 'Bad Request - Invalid filter values provided',
    schema: {
      type: 'object',
      properties: {
        message: {
          type: 'string',
          examples: [
            'Invalid minHeight value provided',
            'No valid selected options provided',
            'minHeight cannot be greater than maxHeight'
          ]
        },
        statusCode: { type: 'number', example: 400 }
      }
    }
  })
  async fetchFilteredInfluencers(
    @Body() body: FetchFilteredInfluencersDto
  ) {
    return this.influencerUsecaseProxy
      .getInstance()
      .fetchFilteredInfluencers(
        body.measurementFilter, 
        body.budgetAnswersFilter,
        body.stylesAnswersFilter,
        body.hobbiesAnswersFilter,
        body.sportsAnswersFilter,
        body.locationAnswersFilter,
        body.bodyShapeAnswersFilter
      );
  }
}